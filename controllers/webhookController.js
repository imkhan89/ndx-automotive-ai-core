const { processQuery } = require("../core/queryEngine");
const { sendWhatsAppMessage } = require("../services/whatsappService");

module.exports = {

  handleWebhook: async (req, res) => {
    try {
      const entry = req.body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      const message = value?.messages?.[0];

      if (!message) return res.sendStatus(200);

      const from = message.from;
      const text = message.text?.body || "";

      console.log("💬 USER:", text);

      // 🔥 NEW PIPELINE (REPLACES orchestration)
      const result = await processQuery(text);

      await sendWhatsAppMessage(from, result.reply);

      return res.sendStatus(200);

    } catch (error) {
      console.error("Webhook Error:", error);
      return res.sendStatus(500);
    }
  }

};
