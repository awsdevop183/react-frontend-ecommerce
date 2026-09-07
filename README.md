# Contoso Gear — Storefront

A sample e-commerce frontend built with React + Vite. Browse a catalog, filter it,
open a product, build a cart that survives a refresh, and complete a validated
checkout.

There is no backend yet. The app talks to a small API layer that currently answers
from a local seed catalog, so the whole storefront runs on its own — and the backend
can be dropped in later without touching a single component.

---

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with hot reload |
| `npm test` | Vitest — 31 tests |
| `npm run build` | Production bundle into `dist/` |
| `npm start` | Serves the built `dist/` on port 8080 via `server.js` |

---

## What's in it

**Storefront**
- Home page with featured products and category tiles
- Catalog with search, category, price and stock filters, plus sorting
- Product detail pages with specs and related products
- Cart with quantity steppers, stock caps and live totals
- Checkout with per-field validation, then an order confirmation

**Behaviour**
- **Filters live in the URL.** `/products?categoryId=audio&sort=price-asc` is
  shareable, bookmarkable, and the back button works. Reload and the view survives.
- **The cart persists** to `localStorage`, so it is still there after a refresh.
- **Search is debounced** (300ms) while the other filters apply instantly.
- **Requests abort** when you change filters mid-flight, so a slow response can't
  overwrite a newer one — no flicker between old and new results.
- **Loading is a skeleton**, not a spinner; the layout doesn't jump when data lands.
- **Prices are integer cents** everywhere, formatted only for display. No float
  rounding drift in cart totals.

---

## Project structure

```
src/
├── api/
│   ├── client.js          # fetch wrapper, error handling, isMockMode flag
│   ├── catalog.js         # listProducts, getProductBySlug, listCategories
│   ├── orders.js          # priceCart, createOrder
│   └── mock/
│       ├── catalog.js     # 18 seed products  ← delete when the API is real
│       └── handlers.js    # filtering, sorting, pagination, fake latency
├── components/            # ProductCard, Navbar, CartLineItem, filters, ...
├── context/CartContext.jsx
├── hooks/                 # useAsync (with abort), useDebouncedValue
├── pages/                 # Home, Catalog, ProductDetail, Cart, Checkout, ...
└── utils/                 # formatting, pricing maths
```

---

## Adding the backend later

This is the seam. Every API function in `src/api/` has the same shape:

```js
export function listProducts(params = {}, { signal } = {}) {
  if (isMockMode) return mock.listProducts(params)
  return request(`/api/products${buildQuery(params)}`, { signal })
}
```

`isMockMode` is true only while `VITE_API_BASE_URL` is empty. Point that at the real
API and every call becomes HTTP — **no component changes**, because components import
from `src/api/`, never from the mock.

The mock handlers already return the response shapes a real API should:

| Endpoint | Response |
| --- | --- |
| `GET /api/products` | `{ items, total, page, pageSize }` |
| `GET /api/products/:slug` | a product object |
| `GET /api/products/:slug/related` | array of products |
| `GET /api/categories` | `[{ id, name, productCount }]` |
| `POST /api/cart/price` | `[{ productId, available, unitPriceCents }]` |
| `POST /api/orders` | `{ reference, status, totalCents, estimatedDelivery, ... }` |

Build the backend to match these and the frontend already works against it. When the
DB layer follows, `src/api/mock/` gets deleted and nothing else moves.

In development you can skip CORS entirely — `vite.config.js` proxies `/api` to
`VITE_API_PROXY_TARGET` (default `http://localhost:3000`).

---

## Configuration

Copy `.env.example` to `.env.local`:

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Empty = use the seed catalog. Set it to switch to a real API. |
| `VITE_USE_MOCK_API` | Set `false` to force real HTTP even with no base URL. |
| `VITE_API_PROXY_TARGET` | Dev-server proxy target for `/api/*`. |

Anything prefixed `VITE_` is **baked into the client bundle at build time** and is
visible to anyone who opens devtools. Never put a secret in one.

---

## A note on hosting this as a static SPA

`server.js` is a ~50-line Express server used by `npm start`. It exists because of one
thing: a single-page app needs every unmatched URL to return `index.html`. Serve the
raw `dist/` folder without that fallback and the homepage works, but refreshing on
`/products/tactile-75-keyboard` returns a 404.

It also sets sensible cache headers — hashed assets immutable, `index.html` never
cached — and exposes `/healthz` for a host health check.

`public/web.config` does the same job through an IIS rewrite rule if you serve the
static files on Windows instead of running Node.

Verified locally: `/`, `/products`, `/products/:slug`, `/cart`, `/checkout` and
unknown paths all return the app shell with a 200.
