const { chromium } = require('playwright');

async function scrapeLazada(query) {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
  });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    locale: 'en-PH',
    extraHTTPHeaders: {
      'Accept-Language': 'en-PH,en;q=0.9',
    },
  });

  const page = await context.newPage();

  // Mask automation signals
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  const results = [];

  try {
    const searchUrl = `https://www.lazada.com.ph/catalog/?q=${encodeURIComponent(query)}&sort=popularity`;
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for product cards
    await page.waitForSelector('[data-qa-locator="product-item"]', { timeout: 15000 }).catch(() => {});

    const items = await page.evaluate(() => {
      const cards = document.querySelectorAll('[data-qa-locator="product-item"]');
      const data = [];

      cards.forEach((card, i) => {
        if (i >= 12) return;

        const titleEl = card.querySelector('[data-qa-locator="general-products-name"]') ||
                        card.querySelector('.RfADt') ||
                        card.querySelector('a[title]');
        const priceEl = card.querySelector('[data-qa-locator="price"]') ||
                        card.querySelector('.ooOxS');
        const imgEl = card.querySelector('img');
        const linkEl = card.querySelector('a[href]');
        const ratingEl = card.querySelector('[data-qa-locator="stars"]') ||
                         card.querySelector('.score-average');
        const soldEl = card.querySelector('[data-qa-locator="sold-count"]') ||
                       card.querySelector('._6uN7R');

        const title = titleEl?.textContent?.trim() || titleEl?.getAttribute('title') || '';
        const priceRaw = priceEl?.textContent?.trim() || '';
        const price = parseFloat(priceRaw.replace(/[^0-9.]/g, '')) || 0;
        const image = imgEl?.src || imgEl?.dataset?.src || '';
        const link = linkEl?.href || '';
        const rating = parseFloat(ratingEl?.textContent?.trim()) || null;
        const sold = soldEl?.textContent?.trim() || null;

        if (title && price > 0) {
          data.push({ title, price, priceFormatted: priceRaw, image, link, rating, sold, source: 'lazada' });
        }
      });

      return data;
    });

    results.push(...items);
  } catch (err) {
    console.error('[Lazada Scraper Error]', err.message);
  } finally {
    await browser.close();
  }

  return results;
}

module.exports = { scrapeLazada };
