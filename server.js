require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

// ===== ROOT CHECK =====
app.get("/", (req, res) => {
  res.send("🚀 ndx Automotive AI is LIVE");
});

// ===== WEBHOOK =====
app.post("/webhook", (req, res) => {
  const message = req.body.message || "";

  console.log("Incoming:", message);

  let reply = "";

  // ===== BASIC AUTO PARTS LOGIC =====
  const lower = message.toLowerCase();

  if (lower.includes("swift") && lower.includes("air filter")) {
    reply = `🔍 Product Search: Air Filter
🚗 Vehicle: Suzuki Swift

Available Options:
1. Genuine Air Filter – PKR 2500
2. Aftermarket Air Filter – PKR 1800

Reply with option number to proceed.`;
  } 
  else if (lower === "1") {
    reply = `✅ Selected: Genuine Air Filter
Price: PKR 2500

Confirm order? (Yes/No)`;
  } 
  else if (lower === "yes") {
    reply = `🎉 Order confirmed!

Our team will contact you shortly.`;
  } 
  else if (!message) {
    reply = "Please send a message.";
  } 
  else {
    reply = `Please provide:
Make Model Year Product

Example:
Honda Civic 2016 brake pads`;
  }

  console.log("Reply:", reply);

  res.json({ reply });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
