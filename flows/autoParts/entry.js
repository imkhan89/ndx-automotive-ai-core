// FILE: flows/autoParts/entry.js

const stateRepository = require("../../state/stateRepository");
const { parseUserInput } = require("../../services/aiParser");

// Mock product database (will be replaced by Shopify later)
function getMockProducts(part) {
  return [
    {
      id: 1,
      name: `Genuine ${part}`,
      price: 2500,
    },
    {
      id: 2,
      name: `Aftermarket ${part}`,
      price: 1800,
    },
  ];
}

// MAIN ENTRY FUNCTION
async function autoPartsFlow(message, userId) {
  const userState = stateRepository.getState(userId);

  // 🟢 STEP 1: NEW SEARCH (NO STATE OR RESET)
  if (!userState || userState.step === "start") {
    const aiData = await parseUserInput(message);

    if (!aiData || !aiData.part) {
      return {
        reply: "⚠️ Could not understand. Please try again.",
      };
    }

    const { make, model, part } = aiData;

    const products = getMockProducts(part);

    // Save state
    stateRepository.setState(userId, {
      step: "awaiting_selection",
      make,
      model,
      part,
      products,
    });

    let optionsText = `🔍 Product Search: ${part}\n🚗 Vehicle: ${make} ${model}\n\nAvailable Options:\n`;

    products.forEach((p) => {
      optionsText += `${p.id}. ${p.name} - PKR ${p.price}\n`;
    });

    optionsText += `\nReply with option number to proceed.`;

    return { reply: optionsText };
  }

  // 🟡 STEP 2: USER SELECTS PRODUCT
  if (userState.step === "awaiting_selection") {
    const selectedId = parseInt(message);

    const selectedProduct = userState.products.find(
      (p) => p.id === selectedId
    );

    if (!selectedProduct) {
      return {
        reply: "⚠️ Invalid option. Please select a valid number.",
      };
    }

    // Save selection
    stateRepository.setState(userId, {
      ...userState,
      step: "awaiting_confirmation",
      selectedProduct,
    });

    return {
      reply: `✅ Selected: ${selectedProduct.name}\nPrice: PKR ${selectedProduct.price}\n\nConfirm order? (Yes/No)`,
    };
  }

  // 🔵 STEP 3: CONFIRMATION
  if (userState.step === "awaiting_confirmation") {
    const msg = message.toLowerCase();

    if (msg === "yes") {
      stateRepository.clearState(userId);

      return {
        reply: "🎉 Order confirmed!\nOur team will contact you shortly.",
      };
    }

    if (msg === "no") {
      stateRepository.clearState(userId);

      return {
        reply: "❌ Order cancelled.\nYou can search again anytime.",
      };
    }

    return {
      reply: "⚠️ Please reply with Yes or No.",
    };
  }

  // 🔁 FALLBACK (RESET FLOW)
  stateRepository.clearState(userId);

  return {
    reply: "⚠️ Session reset. Please start again.",
  };
}

module.exports = { autoPartsFlow };
