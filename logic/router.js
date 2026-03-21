const autoPartsEntry = require("../flows/autoParts/entry");
const chatFlow = require("../flows/chatFlow");

const routeMessage = async (userId, message) => {
  try {
    const text = message.toLowerCase();

    console.log("🧠 Routing message:", text);

    // ===============================
    // 🔹 AUTO PARTS INTENT
    // ===============================
    if (
      text.includes("filter") ||
      text.includes("brake") ||
      text.includes("spark") ||
      text.includes("plug") ||
      text.includes("oil") ||
      text.includes("part")
    ) {
      console.log("🚗 Auto Parts Flow Triggered");

      return await autoPartsEntry(userId, message);
    }

    // ===============================
    // 🔹 DEFAULT CHAT
    // ===============================
    console.log("🤖 Chat Flow Triggered");

    return await chatFlow(userId, message);

  } catch (err) {
    console.error("❌ Router error:", err.message);
  }
};

module.exports = { routeMessage };
