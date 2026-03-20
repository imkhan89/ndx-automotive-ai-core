require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

// ==============================
// ROOT ROUTE (CHECK SERVER)
// ==============================
app.get("/", (req, res) => {
  res.send("🚀 ndx Automotive AI is LIVE");
});

// ==============================
// WEBHOOK GET (FOR BROWSER TEST)
// ==============================
app.get("/webhook", (req, res) => {
  res.send("✅ Webhook is working. Use POST to send data.");
});

// ==============================
// SIMPLE IN-MEMORY STATE
// ==============================
const userState = {};

// ==============================
// WEBHOOK POST (MAIN LOGIC)
// ==============================
app.post("/webhook", (req, res) => {
  const message = (req.body.message || "").toLowerCase();
  const userId = req.body.userId || "test_user";

  console.log("📩 Incoming:", message);

  // Initialize user state
  if (!userState[userId]) {
    userState[userId] = {
      step: "start",
      lastOptions: []
    };
  }

  let state = userState[userId];
  let reply = "";

  // ==============================
  // FLOW LOGIC
  // ==============================

  // STEP 1: PRODUCT SEARCH
  if (message.includes("swift") && message.includes("air filter")) {
    state.step = "awaiting_selection";
    state.lastOptions = [
      { name: "Genuine Air Filter", price: 2500 },
      { name: "Aftermarket Air Filter", price: 1800 }
    ];

    reply = `🔍 Product Search: Air Filter
🚗 Vehicle: Suzuki Swift

Available Options:
1. Genuine Air Filter – PKR 2500
2. Aftermarket Air Filter – PKR 1800

Reply with option number to proceed.`;
  }

  // STEP 2: OPTION SELECTION
  else if (state.step === "awaiting_selection" && (message === "1" || message === "2")) {
    const selected = state.lastOptions[parseInt(message) - 1];

    state.step = "awaiting_confirmation";
    state.selectedProduct = selected;

    reply = `✅ Selected: ${selected.name}
Price: PKR ${selected.price}

Confirm order? (Yes/No)`;
  }

  // STEP 3: CONFIRMATION
  else if (state.step === "awaiting_confirmation" && message === "yes") {
    state.step = "completed";

    reply = `🎉 Order confirmed!

Our team will contact you shortly.`;
  }

  // STEP 4: CANCEL
  else if (state.step === "awaiting_confirmation" && message === "no") {
    state.step = "start";

    reply = `❌ Order cancelled.

You can search again anytime.`;
  }

  // STEP 5: FALLBACK
  else if (!message) {
    reply = "Please send a message.";
  } else {
    state.step = "start";

    reply = `Please provide:
Make Model Year Product

Example:
Honda Civic 2016 brake pads`;
  }

  // ==============================
  // LOGGING
  // ==============================
  console.log("🧠 State:", state);
  console.log("📤 Reply:", reply);

  // ==============================
  // RESPONSE
  // ==============================
  res.json({ reply });
});

// ==============================
// START SERVER
// ==============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
