const flowRouter = require("../routers/flowRouter");
const normalize = require("../ai/queryNormalizer");

const { sendTextMessage } = require("../services/whatsappService");

async function runMessagePipeline({ from, text }) {
  try {
    // 🔹 STEP 1: Normalize input (AI layer)
    text = normalize(text || "");

    // 🔹 STEP 2: Route message (state-first system)
    const result = await flowRouter.route({
      user: from,
      text
    });

    // 🔹 STEP 3: Send response ONLY if router returns reply
    if (result && result.reply) {
      await sendTextMessage(from, result.reply);
    }

    // 🔹 If result is null → flow already handled response

  } catch (error) {
    console.error("Pipeline Error:", error);

    await sendTextMessage(
      from,
      "⚠️ Something went wrong. Please try again."
    );
  }
}

module.exports = { runMessagePipeline };
