// FILE: server.js

require("dotenv").config();

const express = require("express");
const app = express();

// 🔥 ROUTES
const whatsappWebhook = require("./routes/whatsappWebhook");

// 🔥 AI TEST (OPTIONAL BUT USEFUL)
const aiParser = require("./services/aiParser");

// ==============================
// 🔧 MIDDLEWARE
// ==============================
app.use(express.json());

// ==============================
// 🏠 ROOT ROUTE
// ==============================
app.get("/", (req, res) => {
  res.send("🚀 NDX Automotive AI Server Running");
});

// ==============================
// 🧪 HEALTH CHECK
// ==============================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "NDX Automotive AI",
    time: new Date()
  });
});

// ==============================
// 🧠 TEST AI ENDPOINT
// ==============================
app.post("/test-ai", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const result = await aiParser(message);

    res.json({
      input: message,
      parsed: result
    });

  } catch (error) {
    console.error("❌ AI Test Error:", error);

    res.status(500).json({
      error: "AI parsing failed"
    });
  }
});

// ==============================
// 📲 WHATSAPP WEBHOOK
// ==============================
app.use("/webhook", whatsappWebhook);

// ==============================
// ❌ 404 HANDLER
// ==============================
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

// ==============================
// 🚨 GLOBAL ERROR HANDLER
// ==============================
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  res.status(500).json({
    error: "Internal Server Error"
  });
});

// ==============================
// 🚀 START SERVER
// ==============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
