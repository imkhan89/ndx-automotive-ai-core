const { searchProducts } = require("../../services/shopifyService");

// ===============================
// 🔥 SESSION STORE
// ===============================
const userSessions = {};

// ===============================
// 🔥 CLASSIFY PRODUCT TYPE
// ===============================
function classifyProduct(title) {
  const t = title.toLowerCase();

  if (t.includes("denso")) return "premium";
  if (t.includes("genuine") || t.includes("oem")) return "oem";
  if (t.includes("imported")) return "budget";

  return "standard";
}

// ===============================
// 🔥 FORMAT RESPONSE
// ===============================
function formatProductList(products, queryText) {
  let premium = [];
  let oem = [];
  let budget = [];
  let standard = [];

  products.forEach((p, index) => {
    const category = classifyProduct(p.title);

    const item = {
      index: index + 1,
      ...p
    };

    if (category === "premium") premium.push(item);
    else if (category === "oem") oem.push(item);
    else if (category === "budget") budget.push(item);
    else standard.push(item);
  });

  let message = `🔧 *Results for:* ${queryText}\n\n`;

  const addSection = (title, list) => {
    if (!list.length) return;

    message += `${title}\n`;

    list.forEach(item => {
      message += `${item.index}. ${item.title}\n`;
      message += `💰 PKR ${item.price}\n`;
      message += `🔗 ${item.url}\n\n`;
    });
  };

  addSection("🥇 Premium Options:", premium);
  addSection("🥈 OEM Options:", oem);
  addSection("🥉 Budget Options:", budget);
  addSection("🔹 Other Options:", standard);

  message += "👉 Reply with the *option number* to select product.";

  return message;
}

// ===============================
// 🔥 MAIN FLOW
// ===============================
async function handleAutoPartsFlow(userId, message, aiData = null) {
  try {
    const session = userSessions[userId] || {};

    // ===============================
    // 🔹 STEP 1: SEARCH
    // ===============================
    if (!session.step) {
      // ✅ Build search query
      let queryText = message;

      if (aiData && typeof aiData === "object") {
        queryText = `${aiData.make || ""} ${aiData.model || ""} ${aiData.part || ""}`.trim();
      }

      console.log("🔍 Searching for:", queryText);

      const results = await searchProducts(queryText);

      if (!results.length) {
        return "❌ No products found. Please refine your query (e.g., Corolla 2015 air filter).";
      }

      userSessions[userId] = {
        step: "SELECTING",
        products: results,
        query: queryText
      };

      return formatProductList(results, queryText);
    }

    // ===============================
    // 🔹 STEP 2: SELECT PRODUCT
    // ===============================
    if (session.step === "SELECTING") {
      const index = parseInt(message);

      if (isNaN(index) || index < 1 || index > session.products.length) {
        return "❌ Invalid selection. Please reply with a valid option number.";
      }

      const selectedProduct = session.products[index - 1];

      userSessions[userId].step = "CONFIRMING";
      userSessions[userId].selectedProduct = selectedProduct;

      return `🛒 *Order Summary:*\n\n` +
        `📦 ${selectedProduct.title}\n` +
        `💰 PKR ${selectedProduct.price}\n` +
        `🔗 ${selectedProduct.url}\n\n` +
        `👉 Reply *YES* to confirm order\n👉 Reply *NO* to cancel`;
    }

    // ===============================
    // 🔹 STEP 3: CONFIRM ORDER
    // ===============================
    if (session.step === "CONFIRMING") {
      const lower = message.toLowerCase();

      if (lower === "yes") {
        const product = session.selectedProduct;

        delete userSessions[userId];

        return `✅ *Order Confirmed!*\n\n` +
          `📦 ${product.title}\n` +
          `💰 PKR ${product.price}\n\n` +
          `🚚 Our team will contact you shortly.`;
      }

      if (lower === "no") {
        delete userSessions[userId];
        return "❌ Order cancelled. You can search again anytime.";
      }

      return "❗ Please reply with *YES* or *NO*.";
    }

    return "⚠️ Something went wrong. Please try again.";

  } catch (err) {
    console.error("❌ AutoParts Flow Error:", err.message);
    return "⚠️ System error. Please try again.";
  }
}

module.exports = {
  handleAutoPartsFlow
};
