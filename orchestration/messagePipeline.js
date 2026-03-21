const flowRouter = require("../routers/flowRouter");
const normalize = require("../ai/queryNormalizer");

const { sendTextMessage } = require("../services/whatsappService");

async function runMessagePipeline({ from, text }) {
  try {
    // 🔹 STEP 1: Normalize input
    text = normalize(text || "");

    console.log("🧠 Routing message:", text);

    // 🔹 STEP 2: Route via flow system
    const result = await flowRouter.route({
      user: from,
      text
    });

    // 🔹 STEP 3: Send ONLY if router returns reply
    if (result && result.reply) {
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
