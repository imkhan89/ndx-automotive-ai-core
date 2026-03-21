const { searchProducts } = require("../services/shopifyService");
const { sendTextMessage } = require("../services/whatsappService");

// 🔥 Extract intent
function extractIntent(text) {
  const lower = text.toLowerCase();

  let car = null;
  let year = null;
  let product = null;

  // 🚗 CAR DETECTION
  if (lower.includes("corolla")) car = "corolla";
  if (lower.includes("civic")) car = "civic";
  if (lower.includes("city")) car = "city";

  // 📅 YEAR DETECTION
  const yearMatch = lower.match(/\b(20\d{2}|19\d{2})\b/);
  if (yearMatch) year = yearMatch[0];

  // 🔧 PRODUCT DETECTION
  if (lower.includes("air filter")) product = "air filter";
  if (lower.includes("oil filter")) product = "oil filter";
  if (lower.includes("brake pad")) product = "brake pad";
  if (lower.includes("spark plug")) product = "spark plug";

  return { car, year, product };
}

// 🔥 Build smart query
function buildSearchQuery(intent) {
  let query = "";

  if (intent.car) query += intent.car + " ";
  if (intent.year) query += intent.year + " ";
  if (intent.product) query += intent.product;

  return query.trim();
}

exports.processUserMessage = async (from, userText) => {
  try {
    console.log("🧠 Processing AI for:", userText);

    const intent = extractIntent(userText);

    // ❌ If nothing understood
    if (!intent.car && !intent.product) {
      return await sendTextMessage(
        from,
        `👋 Welcome to ndestore.com!\n\n🚗 Please tell:\n• Car model\n• Product\n\nExample:\nCorolla 2015 air filter`
      );
    }

    const query = buildSearchQuery(intent);

    console.log("🔍 Search Query:", query);

    const results = await searchProducts(query);

    // ❌ No results
    if (!results || results.length === 0) {
      return await sendTextMessage(
        from,
        `❌ No exact match found.\n\n👉 Please specify:\n• Car model\n• Model year\n• Part name\n\nExample:\nCorolla 2018 air filter`
      );
    }

    // ✅ Show top 3 results
    let message = `🔍 Top Matches Found:\n\n`;

    results.slice(0, 3).forEach((p, i) => {
      message += `${i + 1}️⃣ ${p.title}\n💰 Rs. ${p.price}\n\n`;
    });

    message += `👉 Reply with product name to order`;

    await sendTextMessage(from, message);

  } catch (error) {
    console.error("❌ AI Error:", error.message);

    await sendTextMessage(
      from,
      "⚠️ Something went wrong. Please try again."
    );
  }
};
