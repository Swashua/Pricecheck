# PriceCheck PH

> Real-time e-commerce price tracker for **Lazada Philippines** with an interactive UI, intelligent anti-bot scraping, and in-memory caching.

---

## Features

- **Live Product Scraping**: Real-time pricing, ratings, sales counts, and stock listings directly from Lazada PH.
- **Stealth Browser Automation**: Headless Playwright integration with `puppeteer-extra-plugin-stealth` and user-agent emulation to bypass anti-bot challenges.
- **In-Memory Caching**: 5-minute TTL query cache to minimize outbound network requests, improve response latency, and reduce rate limits.
- **Modern Responsive UI**: Built with React 19 and Vite, featuring an interactive celestial constellation canvas background and a Teal & Lemon Chiffon theme.
- **Flexible Sorting**: Instantly sort retrieved results by Lowest Price, Highest Price, Rating, or Most Sold.
- **Cheapest Item Highlighting**: Automatically detects and marks the lowest-priced deal for quick decision making.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Canvas API (Interactive Constellations), CSS Variables |
| **Backend** | Node.js, Fastify, `@fastify/cors` |
| **Scraping** | Playwright (`playwright-extra`), `puppeteer-extra-plugin-stealth`, Cheerio, Axios |
| **Region & Currency** | Philippines · Philippine Peso (₱ PHP) |

---

## Project Structure

```
pricecheck-ph/
├── backend/                  # Fastify API Server (Port 3001)
│   ├── scraper/
│   │   └── lazada.js         # Playwright scraper with stealth plugin
│   ├── server.js             # API routes & in-memory cache
│   └── package.json
├── frontend/                 # Vite + React Client (Port 5173)
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoadingState.jsx    # Animated loading indicator
│   │   │   ├── Particles.jsx       # Interactive constellation background
│   │   │   ├── PlatformHeader.jsx  # Platform metadata banner
│   │   │   ├── ProductCard.jsx     # Product card display
│   │   │   └── SearchIcon.jsx      # SVG icon component
│   │   ├── App.jsx           # Main application view & sorting logic
│   │   ├── index.css         # Teal & Lemon Chiffon design system
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)
- Playwright Chromium browser binaries:
  ```bash
  npx playwright install chromium
  ```

### 1. Setup & Start Backend

```bash
cd backend
npm install
npm run dev
```
The backend server runs on `http://localhost:3001`.

### 2. Setup & Start Frontend

```bash
cd frontend
npm install
npm run dev
```
The frontend application will be accessible at `http://localhost:5173`.

---

## API Reference

### `GET /search?q=<query>`

Search Lazada for matching products.

- **Query Parameters**:
  - `q` *(string, required)*: The product keyword or title to search (e.g., `mechanical keyboard`).

- **Example Request**:
  ```http
  GET http://localhost:3001/search?q=mechanical+keyboard
  ```

- **Example Response**:
  ```json
  {
    "query": "mechanical keyboard",
    "cached": false,
    "results": {
      "lazada": [
        {
          "title": "Redragon K552 Mechanical Gaming Keyboard RGB",
          "price": 1850.00,
          "priceFormatted": "₱1,850.00",
          "rating": 4.9,
          "sold": "1.2k sold",
          "image": "https://...",
          "link": "https://www.lazada.com.ph/products/..."
        }
      ]
    }
  }
  ```

### `GET /health`

Liveness probe to confirm backend status.

- **Response**:
  ```json
  {
    "status": "ok",
    "timestamp": "2026-10-11T08:30:30.170Z"
  }
  ```

---

## Notes and Disclaimer

- **Anti-Bot Defenses**: Lazada actively employs bot mitigation systems. If requests are blocked or challenged, retrying after a brief cooldown is recommended.
- **Educational / Personal Use**: This project is developed solely for educational and personal price comparison purposes. Automated scraping may be subject to platform terms of service.
