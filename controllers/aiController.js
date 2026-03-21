const { sendTextMessage } = require("../services/whatsappService");
const { searchProducts } = require("../services/shopifyService");

async function processUserMessage(user, text) {
  try {
    console.log("🧠 Processing AI for:", text);

    // Simple search (we upgrade later)
    const products = await searchProducts(text);

    if (!products.length) {
      await sendTextMessage(user, "❌ No product found.");
      return;
    }

    const top3 = products.slice(0, 3);

    let reply = "🔍 *Top Matches Found:*\n\n";

    top3.forEach((p, i) => {
      reply += `${i + 1}️⃣ ${p.title}\n💰 Rs.${p.price}\n\n`;
    });

    reply += "🔥 Fast moving items\n";
    reply += "👉 Reply 1, 2, or 3 to select\n";
    reply += "👉 Reply *ORDER* to confirm";

    await sendTextMessage(user, reply);

  } catch (error) {
    console.error("AI Error:", error);
  }
}

module.exports = { processUserMessage };
