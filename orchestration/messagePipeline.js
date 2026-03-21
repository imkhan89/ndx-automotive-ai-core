const { runFlow } = require("./flowPipeline");
const { sendTextMessage } = require("../services/whatsappService");

async function runMessagePipeline({ from, text }) {
  try {
    console.log("💬 USER:", text);

    // 🔹 DIRECT FLOW (NO AI / NO PARSING)
    const result = await runFlow({
      user: from,
      text: text || ""
    });

    console.log("📦 Flow Result:", result);

    // 🔹 SEND RESPONSE
    if (result && result.reply) {
      await sendTextMessage(from, result.reply);
    } else {
      await sendTextMessage(
        from,
        "⚠️ Unable to process request."
      );
    }

  } catch (error) {
    console.error("❌ Pipeline Error:", error);

    await sendTextMessage(
      from,
      "⚠️ System error. Try again."
    );
  }
}

module.exports = { runMessagePipeline };
