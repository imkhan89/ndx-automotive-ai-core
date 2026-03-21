const { handleUserQuery } = require("../app/services/queryService");
const { sendWhatsAppMessage } = require("../services/whatsappService");

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

    if (!userState[from]) {
      userState[from] = {};
    }

    const state = userState[from];

    const reply = await handleUserQuery(text, state);

    await sendWhatsAppMessage(from, reply);

    res.sendStatus(200);

  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    res.sendStatus(500);
  }
};
