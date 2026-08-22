# PriceCheck PH 🇵🇭

> Side-by-side price comparison for **Lazada** and **Shopee** Philippines.

## Stack

| | |
|---|---|
| Frontend | Vite + React |
| Backend | Node.js + Fastify |
| Scraping | Playwright (headless Chromium) |
| Region | Philippines (₱ PHP) |

## Project Structure

```
pricecheck-ph/
├── frontend/   → Vite + React app (port 5173)
└── backend/    → Fastify API + Playwright scrapers (port 3001)
    └── scraper/
        ├── lazada.js   → Lazada PH scraper
        └── shopee.js   → Shopee PH scraper
```

## Getting Started

### 1. Start the backend

```bash
cd backend
node server.js
# or with auto-reload:
npm run dev
```

### 2. Start the frontend

```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

## API

### `GET /search?q=<query>`

Returns up to 12 results from each platform.

```json
{
  "query": "iphone 15",
  "cached": false,
  "results": {
    "lazada": [ { "title": "...", "price": 49999, "priceFormatted": "₱49,999.00", ... } ],
    "shopee": [ { "title": "...", "price": 47500, "priceFormatted": "₱47,500.00", ... } ]
  }
}
```

### `GET /health`

Returns `{ "status": "ok" }` — useful for checking if the backend is alive.

## Notes

- Both Lazada and Shopee use anti-bot measures. Results may vary.
- Results are cached for **5 minutes** to reduce load.
- For personal/educational use only — scraping may violate each platform's ToS.
