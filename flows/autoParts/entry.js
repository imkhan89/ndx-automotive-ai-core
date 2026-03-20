const { parseUserInput } = require("../../services/aiParser");
const { searchProducts } = require("../../services/shopifyService");

async function autoPartsFlow(userMessage, userState) {
  try {
    console.log("USER MESSAGE:", userMessage);

    // ===============================
    // STEP 1: SELECT PRODUCT OPTION
    // ===============================
    if (userState.step === "SELECT_OPTION") {
      const index = parseInt(userMessage) - 1;

      if (
        isNaN(index) ||
        !userState.products ||
        !userState.products[index]
      ) {
        return "❌ Invalid option. Please select a valid number.";
      }

      const product = userState.products[index];

      userState.selectedProduct = product.title;
      userState.price = product.price;

      userState.step = "CONFIRM_ORDER";

      return `✅ Selected: ${userState.selectedProduct}
Price: PKR ${userState.price}

Confirm order? (Yes/No)`;
    }

    // ===============================
    // STEP 2: CONFIRM ORDER
    // ===============================
    if (userState.step === "CONFIRM_ORDER") {
      const msg = userMessage.toLowerCase();

      if (msg === "yes" || msg === "y") {
        userState.step = "COMPLETED";

        return `🎉 Order confirmed!
Product: ${userState.selectedProduct}
Price: PKR ${userState.price}

Our team will contact you shortly.`;
      }

      if (msg === "no" || msg === "n") {
        userState.step = "START";
        return "❌ Order cancelled. Start again.";
      }

      return "Please reply with Yes or No.";
    }

    // ===============================
    // STEP 3: NEW SEARCH (AI PARSING)
    // ===============================
    const aiData = await parseUserInput(userMessage);

    console.log("AI DATA:", aiData);

    if (!aiData) {
      return "⚠️ Could not understand. Please try again.";
    }

    const make = aiData.make || "";
    const model = aiData.model || "";
    const part = aiData.part || "";

    if (!make || !model || !part) {
      return `Please provide:
Make Model Product

Example:
Honda Civic brake pads`;
    }

    // ===============================
    // STEP 4: SHOPIFY SEARCH
    // ===============================
    const products = await searchProducts(part);

    if (!products || products.length === 0) {
      return `❌ No products found for "${part}".`;
    }

    userState.products = products;
    userState.step = "SELECT_OPTION";

    const p1 = products[0];
    const p2 = products[1];

    return `🔍 Product Search: ${part}
🚗 Vehicle: ${make} ${model}

Available Options:
1. ${p1.title} - PKR ${p1.price}
${p2 ? `2. ${p2.title} - PKR ${p2.price}` : ""}

Reply with option number to proceed.`;
  } catch (error) {
    console.error("FLOW ERROR:", error);
    return "⚠️ Server error. Please try again.";
  }
}

module.exports = { autoPartsFlow };
