// FILE: server.js

require("dotenv").config();

const express = require("express");
const app = express();

// ==============================
// 🔥 IMPORT ROUTES & SERVICES
// ==============================
const whatsappWebhook = require("./routes/whatsappWebhook");
const aiParser = require("./services/aiParser");

// ==============================
// 🔧 MIDDLEWARE
// ==============================
app.use(express.json());

// ==============================
// 🏠 ROOT ROUTE (VERSION CHECK)
// ==============================
app.get("/", (req, res) => {
  res.send("🚀 NDX Automotive AI Server Running v2");
});

// ==============================
// 🧪 HEALTH CHECK
// ==============================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "NDX Automotive AI",
    version: "v2",
    time: new Date()
  });
});

// ==============================
// 🧠 TEST AI
// ==============================
app.post("/test-ai", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const parsed = await aiParser(message);

    res.json({
      input: message,
      parsed
    });

  } catch (error) {
    console.error("❌ AI Error:", error);
    res.status(500).json({ error: "AI parsing failed" });
  }
});

// ==============================
// 📲 WHATSAPP WEBHOOK
// ==============================
app.use("/webhook", whatsappWebhook);

// ==============================
// 🧪 DEBUG ROUTE (CRITICAL)
// ==============================
app.get("/webhook-test", (req, res) => {
  res.send("✅ Webhook route is working");
});

// ==============================
// ❌ 404 HANDLER
// ==============================
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// ==============================
// 🚨 GLOBAL ERROR HANDLER
// ==============================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ==============================
// 🚀 START SERVER
// ==============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
