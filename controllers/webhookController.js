const { runMessagePipeline } = require("../orchestration/messagePipeline");

// 🔥 In-memory state (replace with Redis later)
const userState = {};

exports.handleWebhook = async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;
    const text = message.text?.body || "";

    console.log("💬 Incoming:", text);

    // ✅ FIX: Initialize state properly
    if (!userState[from]) {
      userState[from] = {};
    }

    const state = userState[from];

    // ✅ Pass state into pipeline
    await runMessagePipeline({
      from,
      text,
      state
    });

    res.sendStatus(200);

  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    res.sendStatus(500);
  }
};
