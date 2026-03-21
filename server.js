require("dotenv").config();

const express = require("express");
const app = express();

// ===============================
// 🔹 IMPORT ROUTES
// ===============================
const { handleWebhook, verifyWebhook } = require("./controllers/webhookController");

// ===============================
// 🔹 MIDDLEWARE
// ===============================
app.use(express.json());

// ===============================
// 🔹 HEALTH CHECK (CRITICAL - FIXES SIGTERM)
// ===============================
app.get("/", (req, res) => {
  res.status(200).send("Server Alive ✅");
});

// ===============================
// 🔹 WEBHOOK ROUTES
// ===============================
app.get("/webhook", verifyWebhook);   // Meta verification
app.post("/webhook", handleWebhook);  // Incoming messages

// ===============================
// 🔹 START SERVER
// ===============================
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("=================================");
  console.log(`✅ Server running on port ${PORT}`);
  console.log("🌐 Webhook URL: /webhook");
  console.log("=================================");
});
