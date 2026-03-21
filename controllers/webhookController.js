const { routeMessage } = require("../logic/router");

// ===============================
// VERIFY WEBHOOK
// ===============================
const verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === process.env.VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
};

// ===============================
// HANDLE WEBHOOK (CLEAN)
// ===============================
const handleWebhook = async (req, res) => {
  try {
    res.sendStatus(200);

    const value = req.body.entry?.[0]?.changes?.[0]?.value;

    if (!value?.messages) return;

    const msg = value.messages[0];
    const from = msg.from;

    const text =
      msg.text?.body ||
      msg.button?.text ||
      msg.interactive?.button_reply?.title ||
      msg.interactive?.list_reply?.title ||
      "";

    console.log("💬 USER:", text);

    // 🔥 ROUTE TO SYSTEM (IMPORTANT)
    await routeMessage(from, text);

  } catch (err) {
    console.error("❌ Webhook error:", err.message);
  }
};

module.exports = {
  handleWebhook,
  verifyWebhook,
};
