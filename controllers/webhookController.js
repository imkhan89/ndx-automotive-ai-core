const { processQuery } = require("../core/queryEngine");
const { sendWhatsAppMessage } = require("../services/whatsappService");

module.exports = {

  handleWebhook: async (req, res) => {
    try {
      const entry = req.body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      const message = value?.messages?.[0];

      // Ignore non-message events
      if (!message) {
        return res.sendStatus(200);
      }

      const from = message.from;
      const text = message.text?.body || "";

      console.log("💬 Incoming:", text);

      // 🔥 Core Processing
      const result = await processQuery(text);

      // ✅ Fail-safe response
      if (!result || !result.reply) {
        await sendWhatsAppMessage(
          from,
          "⚠️ Unable to process your request. Please try again."
        );
      } else {
        await sendWhatsAppMessage(from, result.reply);
      }

      return res.sendStatus(200);

    } catch (error) {
      console.error("❌ Webhook Error:", error.message);
      return res.sendStatus(500);
    }
  }

};
