const { searchProducts } = require("../../services/shopifyService");

// ===============================
// 🔥 SESSION STORE
// ===============================
const userSessions = {};

// ===============================
// 🔹 CLASSIFY PRODUCTS
// ===============================
function classifyProduct(title) {
  const t = title.toLowerCase();

  if (t.includes("denso")) return "premium";
  if (t.includes("genuine") || t.includes("oem")) return "oem";
  if (t.includes("imported")) return "budget";

  return "standard";
}

// ===============================
// 🔹 FORMAT RESPONSE
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

  message += "👉 Reply with the option number to select product.";

  return message;
}

// ===============================
// 🔥 MAIN ENTRY FUNCTION (FIXED)
// ===============================
async function autoPartsEntry(user, text, state) {
  try {

    const session = userSessions[user] || {};

    // ===============================
    // 🔹 STEP 1: SEARCH
    // ===============================
    if (!session.step) {

      const queryText = text;

      if (!queryText) {
        return {
          reply: "🔍 Please enter product (e.g., Corolla air filter)"
        };
      }

      const results = await searchProducts(queryText);

      if (!results.length) {
        return {
          reply: "❌ No products found. Try again."
        };
      }

      userSessions[user] = {
        step: "SELECTING",
        products: results,
        query: queryText
      };

      return {
        reply: formatProductList(results, queryText)
      };
    }

    // ===============================
    // 🔹 STEP 2: SELECT PRODUCT
    // ===============================
    if (session.step === "SELECTING") {

      const index = parseInt(text);

      if (isNaN(index) || index < 1 || index > session.products.length) {
        return {
          reply: "❌ Invalid selection. Reply with valid number."
        };
      }

      const product = session.products[index - 1];

      userSessions[user].step = "CONFIRMING";
      userSessions[user].selectedProduct = product;

      return {
        reply:
          `🛒 Order Summary:\n\n` +
          `📦 ${product.title}\n` +
          `💰 PKR ${product.price}\n\n` +
          `Reply YES to confirm\nReply NO to cancel`
      };
    }

    // ===============================
    // 🔹 STEP 3: CONFIRM
    // ===============================
    if (session.step === "CONFIRMING") {

      const lower = text.toLowerCase();

      if (lower === "yes") {
        const product = session.selectedProduct;
        delete userSessions[user];

        return {
          reply:
            `✅ Order Confirmed!\n\n` +
            `📦 ${product.title}\n` +
            `💰 PKR ${product.price}\n\n` +
            `Our team will contact you.`
        };
      }

      if (lower === "no") {
        delete userSessions[user];

        return {
          reply: "❌ Order cancelled."
        };
      }

      return {
        reply: "❗ Reply YES or NO"
      };
    }

    return {
      reply: "⚠️ Restarting flow..."
    };

  } catch (error) {
    console.error("AutoParts Error:", error);

    return {
      reply: "⚠️ Auto Parts error. Try again."
    };
  }
}

// ✅ EXPORT FIXED
module.exports = autoPartsEntry;
