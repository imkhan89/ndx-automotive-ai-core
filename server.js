// ==============================
// 🚀 NDX AUTOMOTIVE AI SERVER
// ==============================

const express = require("express");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// ==============================
// 🔧 MIDDLEWARE
// ==============================

// Parse incoming JSON (required for WhatsApp webhook)
app.use(express.json());

// ==============================
// 📥 ROUTES
// ==============================

// Import WhatsApp webhook route
const whatsappWebhook = require("./routes/whatsappWebhook");

// ✅ IMPORTANT: mount at root
app.use("/", whatsappWebhook);

// ==============================
// 🧪 HEALTH CHECK ROUTES
// ==============================

// Root test
app.get("/", (req, res) => {
  res.status(200).send("🚀 NDX Automotive AI Server is LIVE");
});

// Webhook test (optional debug)
app.get("/webhook-test", (req, res) => {
  res.status(200).send("✅ Webhook route is working");
});

// ==============================
// 🚀 START SERVER
// ==============================

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("=================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("=================================");
});
