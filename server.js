require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

// ==============================
// ROOT ROUTE (SERVER CHECK)
// ==============================
app.get("/", (req, res) => {
  res.send("🚀 ndx Automotive AI is LIVE");
});

// ==============================
// WEBHOOK GET (BROWSER TEST)
// ==============================
app.get("/webhook", (req, res) => {
  res.send("✅ Webhook is working. Use POST request.");
});

// ==============================
// IN-MEMORY USER STATE
// ==============================
const userState = {};

// ==============================
// WEBHOOK POST (MAIN LOGIC)
// ==============================
app.post("/webhook", (req, res) => {
  const message = (req.body.message || "").toLowerCase().trim();
  const userId = req.body.userId || "default_user";

  console.log("📩 Incoming:", message);

  // Initialize state if not exists
  if (!userState[userId]) {
    userState[userId] = {
      step: "start",
      lastOptions: [],
      selectedProduct: null
    };
  }

  let state = userState[userId];
  let reply = "";

  // ==============================
  // FLOW LOGIC
  // ==============================

  // STEP 1 — SEARCH
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

  // STEP 2 — SELECT OPTION
  else if (
    state.step === "awaiting_selection" &&
    (message === "1" || message === "2")
  ) {
    const selected = state.lastOptions[parseInt(message) - 1];

    if (!selected) {
      reply = "Invalid selection. Please choose 1 or 2.";
    } else {
      state.step = "awaiting_confirmation";
      state.selectedProduct = selected;

      reply = `✅ Selected: ${selected.name}
Price: PKR ${selected.price}

Confirm order? (Yes/No)`;
    }
  }

  // STEP 3 — CONFIRM ORDER
  else if (state.step === "awaiting_confirmation" && message === "yes") {
    state.step = "completed";

    reply = `🎉 Order confirmed!

Our team will contact you shortly.`;
  }

  // STEP 4 — CANCEL ORDER
  else if (state.step === "awaiting_confirmation" && message === "no") {
    state.step = "start";
    state.selectedProduct = null;

    reply = `❌ Order cancelled.

You can search again anytime.`;
  }

  // STEP 5 — EMPTY INPUT
  else if (!message) {
    reply = "Please send a valid message.";
  }

  // STEP 6 — FALLBACK
  else {
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
