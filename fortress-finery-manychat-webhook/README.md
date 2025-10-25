# Fortress Finery — Manychat Webhook

Small Express server to power Manychat External Requests:
- `GET /products?category=rugs&limit=4` → returns `cards` for a List/Gallery
- `POST /order-status` with JSON `{ "order_number": "FF-12345" }` → returns `{ found, status, eta }`

## Quick start (local)
```bash
npm i
cp .env.example .env
npm run dev
# open http://localhost:3000/
```

## Deploy (Render/Railway/Fly/Heroku)
1. Create a new Web Service from this repo.
2. Set environment variables (see `.env.example`).
3. After deploy, note the public HTTPS URL:
   - Order Status URL: `https://YOUR_HOST/order-status` (POST)
   - Products URL: `https://YOUR_HOST/products?category=rugs&limit=4` (GET)

## Wire into Manychat
- In your flow → **Action → External Request**.
- For Order Status block:
  - Method: POST
  - URL: `https://YOUR_HOST/order-status`
  - Body (JSON): `{ "order_number": "{{order_number}}" }`
  - Map response: `found`, `status`, `eta`.
- For dynamic products:
  - Method: GET
  - URL: `https://YOUR_HOST/products?category={{last_browse_category}}&limit=4`
  - Use `{{response.cards}}` to render a List/Gallery via Manychat UI.

## Replace demo data
- Edit `lookupOrder` and `getProducts` to call your real OMS/Warhead endpoints.
