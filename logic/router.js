const autoPartsFlow = require("../flows/autoPartsFlow");
const chatFlow = require("../flows/chatFlow");

const routeMessage = async (userId, message) => {
  try {
    const text = message.toLowerCase();

    // 🔥 AUTO PARTS DETECTION
    if (
      text.includes("filter") ||
      text.includes("brake") ||
      text.includes("spark") ||
      text.includes("plug") ||
      text.includes("oil")
    ) {
      return await autoPartsFlow(userId, message);
    }

    // 🔥 DEFAULT CHAT
    return await chatFlow(userId, message);

  } catch (err) {
    console.error("❌ Router error:", err.message);
  }
};

module.exports = { routeMessage };
