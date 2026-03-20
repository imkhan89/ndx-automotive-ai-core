require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const { autoPartsFlow } = require("./flows/autoParts/entry");

const app = express();

// Middleware
app.use(bodyParser.json());

// 🌐 ROOT ROUTE (Health Check)
app.get("/", (req, res) => {
  res.send("🚀 ndx Automotive AI is LIVE");
});

// 🧠 AI TEST ROUTE (VERY IMPORTANT FOR DEBUG)
app.get("/test-ai", async (req, res) => {
  try {
    const { parseUserInput } = require("./services/aiParser");

    const result = await parseUserInput("Toyota Corolla air filter");

    console.log("AI TEST RESULT:", result);

    res.json(result);
  } catch (error) {
    console.error("AI TEST ERROR:", error);
    res.status(500).json({ error: "AI test failed" });
  }
});

// 📩 MAIN WEBHOOK (POST)
app.post("/webhook", async (req, res) => {
  try {
    const { message, userId } = req.body;

    // ❌ VALIDATION
    if (!message || !userId) {
      return res.status(200).json({
        reply: "⚠️ Please send a valid message.",
      });
    }

    console.log("Incoming Message:", message, "User:", userId);

    // 🚀 PROCESS FLOW
    const response = await autoPartsFlow(message, userId);

    return res.status(200).json(response);
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);

    return res.status(200).json({
      reply: "⚠️ Server error. Please try again.",
    });
  }
});

// 🚀 START SERVER
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
