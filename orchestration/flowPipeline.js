const flowRouter = require("../routers/flowRouter");

async function runFlow({ user, text }) {
  try {
    // 🔹 Delegate ALL logic to router
    const result = await flowRouter.route({
      user,
      text
    });

    return result;

  } catch (error) {
    console.error("FlowPipeline Error:", error);

    return {
      reply: "⚠️ Flow error. Please try again."
    };
  }
}

module.exports = { runFlow };
