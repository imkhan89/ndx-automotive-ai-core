const flowRouter = require("../routers/flowRouter");
const normalize = require("../ai/queryNormalizer");

const { sendTextMessage } = require("../services/whatsappService");

async function runMessagePipeline({ from, text }) {
  try {
    // 🔹 STEP 1: Normalize input (AI layer)
    text = normalize(text);

    // 🔹 STEP 2: Route message (state-first system)
    const result = await flowRouter.route({
      user: from,
      text
    });

    // 🔹 STEP 3: Send response
    if (result?.reply) {
      await sendTextMessage(from, result.reply);
    }

  } catch (error) {
    console.error("Pipeline Error:", error);

    await sendTextMessage(
      from,
      "⚠️ Something went wrong. Please try again."
    );
  }
}

module.exports = { runMessagePipeline };
