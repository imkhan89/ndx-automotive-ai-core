const { runFlow } = require("./flowPipeline");
const { sendTextMessage } = require("../services/whatsappService");

async function runMessagePipeline({ from, text }) {
  try {
    console.log("🧠 Incoming:", text);

    // STEP 1: DIRECT FLOW (NO AI PARSER)
    const result = await runFlow({ text, from });

    console.log("📦 Flow Result:", result);

    // STEP 2: SEND RESPONSE
    if (result?.reply) {
      await sendTextMessage(from, result.reply);
    } else {
      await sendTextMessage(from, "⚠️ No response generated.");
    }

  } catch (error) {
    console.error("❌ Pipeline Error:", error);

    await sendTextMessage(
      from,
      "⚠️ Something went wrong. Please try again."
    );
  }
}

module.exports = { runMessagePipeline };
