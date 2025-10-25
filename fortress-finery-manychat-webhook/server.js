// server.js
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

// Basic health check
app.get("/", (req, res) => res.json({ ok: true, name: "fortress-finery-manychat-webhook" }));

// Products for a category → returns cards usable in Manychat lists/galleries
app.get("/products", async (req, res) => {
  const { category = "rugs", limit = 4 } = req.query;
  const items = await getProducts(category, Number(limit));
  const cards = items.map(p => ({
    title: `${p.title} — $${p.price}`,
    subtitle: p.subtitle || "Tap to view details",
    image_url: p.image_url,
    buttons: [{ type: "url", url: p.url, caption: "View details" }]
  }));
  res.json({ cards });
});

// Order status lookup
app.post("/order-status", async (req, res) => {
  const orderNumber = req.body?.order_number || req.query?.order_number;
  if (!orderNumber) return res.status(400).json({ error: "order_number required" });
  const data = await lookupOrder(orderNumber);
  if (!data) return res.json({ found: false });
  res.json({ found: true, status: data.status, eta: data.eta });
});

// --- Replace with your real data sources ---
async function getProducts(category, limit) {
  // TODO: call your CMS/Warhead endpoint
  const cdn = process.env.PRODUCT_IMAGE_CDN || "https://example.com/images";
  const base = process.env.STORE_BASE_URL || "https://www.fortressfinery.com";
  const demo = [
    {
      title: "Handwoven Terra Rug",
      subtitle: "Warm terracotta, 5×8",
      image_url: `${cdn}/terra.jpg`,
      url: `${base}/rugs/terra`,
      price: 189
    },
    {
      title: "Coastal Loom Rug",
      subtitle: "Sand + sea palette, 6×9",
      image_url: `${cdn}/coastal.jpg`,
      url: `${base}/rugs/coastal`,
      price: 219
    },
    {
      title: "Midnight Geometry Rug",
      subtitle: "Graphic black/charcoal, 5×7",
      image_url: `${cdn}/midnight.jpg`,
      url: `${base}/rugs/midnight`,
      price: 249
    },
    {
      title: "Cloud Shag Rug",
      subtitle: "Ultra‑soft ivory, 5×8",
      image_url: `${cdn}/cloud.jpg`,
      url: `${base}/rugs/cloud`,
      price: 179
    }
  ];
  return demo.slice(0, limit);
}

async function lookupOrder(orderNumber) {
  // TODO: Query your OMS/Warhead API and map to { status, eta }
  if ((orderNumber || "").toUpperCase() === "FF-12345") {
    return { status: "Shipped", eta: "Oct 30, 2025" };
  }
  return null;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Webhook running on ${PORT}`));
