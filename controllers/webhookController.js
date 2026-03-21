const { sendTextMessage } = require("../services/whatsappService");
// (Optional - enable later)
// const { processUserMessage } = require("./aiController");

async function handleWebhook(req, res) {
  try {
    console.log("=================================");
    console.log("🔥 WEBHOOK EVENT RECEIVED");
    console.log("=================================");

    // ✅ Always respond to Meta FIRST (avoid timeout)
    res.sendStatus(200);

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    // Debug full payload (VERY IMPORTANT during testing)
    console.log("📦 FULL PAYLOAD:");
    console.log(JSON.stringify(req.body, null, 2));

    // If no messages (delivery/read events etc.)
    if (!value?.messages) {
      console.log("ℹ️ No user message (status update event)");
      return;
    }

    const message = value.messages[0];

    const from = message.from;
    const messageType = message.type;

    console.log("📩 From:", from);
    console.log("📌 Type:", messageType);

    let userText = "";

    // =====================================================
    // ✅ HANDLE DIFFERENT MESSAGE TYPES
    // =====================================================

    if (messageType === "text") {
      userText = message.text.body;
    } else if (messageType === "button") {
      userText = message.button.text;
    } else if (messageType === "interactive") {
      userText =
        message.interactive?.button_reply?.title ||
        message.interactive?.list_reply?.title ||
        "interactive message";
    } else {
      userText = "Unsupported message type";
    }

    console.log("💬 User Message:", userText);

    // =====================================================
    // ✅ SIMPLE TEST REPLY (CONFIRM SYSTEM WORKING)
    // =====================================================

    await sendTextMessage(
      from,
      `✅ Received: ${userText}`
    );

    // =====================================================
    // 🚀 NEXT (UNCOMMENT WHEN READY)
    // =====================================================
    // await processUserMessage(from, userText);

  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error);
  }
}

module.exports = {
  handleWebhook,
};
