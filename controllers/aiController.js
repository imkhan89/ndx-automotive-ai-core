const { sendTextMessage } = require("../services/whatsappService");
const { searchProducts } = require("../services/shopifyService");

async function processUserMessage(user, text) {
  try {
    console.log("🧠 Processing AI for:", text);

    const message = (text || "").toLowerCase().trim();

    // =====================================================
    // ✅ STEP 1: HANDLE GREETINGS
    // =====================================================

    const greetings = ["hi", "hello", "salam", "assalamualaikum"];

    if (greetings.includes(message)) {
      await sendTextMessage(
        user,
        "👋 Welcome to ndestore.com!\n\n🚗 Please tell me:\n• Car model\n• Model year\n• Required part\n\nExample:\nCorolla 2015 air filter"
      );
      return;
    }

    // =====================================================
    // ✅ STEP 2: HANDLE ORDER INTENT
    // =====================================================

    if (message.includes("order")) {
      await sendTextMessage(
        user,
        "🚀 Great choice!\n\nPlease confirm:\n📍 City\n📞 Phone Number\n\nWe will process your order immediately."
      );
      return;
    }

    // =====================================================
    // ✅ STEP 3: SEARCH PRODUCTS
    // =====================================================

    const products = await searchProducts(message);

    // =====================================================
    // ✅ STEP 4: NO RESULT HANDLING
    // =====================================================

    if (!products || products.length === 0) {
      await sendTextMessage(
        user,
        "❌ No exact match found.\n\n👉 Please specify:\n• Car model\n• Model year\n• Part name\n\nExample:\nCorolla 2018 air filter"
      );
      return;
    }

    // =====================================================
    // ✅ STEP 5: TOP RESULTS (CONVERSION OPTIMIZED)
    // =====================================================

    const topProducts = products.slice(0, 3);

    let reply = "🔍 *Top Matches Found:*\n\n";

    topProducts.forEach((product, index) => {
      reply += `${index + 1}️⃣ ${product.title}\n`;
      reply += `💰 Rs.${product.price}\n\n`;
    });

    reply += "🔥 Fast moving items\n";
    reply += "🚚 Delivery all over Pakistan\n\n";
    reply += "👉 Reply 1, 2, or 3 to select\n";
    reply += "👉 Reply *ORDER* to confirm";

    await sendTextMessage(user, reply);

  } catch (error) {
    console.error("❌ AI Controller Error:", error.message);
  }
}

module.exports = {
  processUserMessage,
};
