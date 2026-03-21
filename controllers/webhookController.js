const { processUserMessage } = require("./aiController");

exports.handleWebhook = async (req, res) => {
  console.log("🔥 WEBHOOK EVENT RECEIVED");

  try {
    const body = req.body;

    if (body.object) {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      const message = value?.messages?.[0];

      if (message && message.type === "text") {
        const from = message.from;
        const userText = message.text.body;

        console.log("📩 From:", from);
        console.log("💬 Message:", userText);

        // ✅ ONLY ONE FLOW (NO DUPLICATION)
        await processUserMessage(from, userText);
      }

      return res.sendStatus(200);
    }

    return res.sendStatus(404);

  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    return res.sendStatus(500);
  }
};
