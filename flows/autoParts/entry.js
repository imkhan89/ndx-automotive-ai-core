const stateRepository = require("../../state/stateRepository");
const { parseUserInput } = require("../../services/aiParser");

// 🔧 Mock products (replace with Shopify later)
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

// 🚀 MAIN FLOW FUNCTION
async function autoPartsFlow(message, userId) {
  try {
    let userState = stateRepository.getState(userId);

    // 🔁 FORCE RESET IF USER TYPES NEW SEARCH
    if (
      message.toLowerCase().includes("filter") ||
      message.toLowerCase().includes("brake") ||
      message.toLowerCase().includes("oil") ||
      message.toLowerCase().includes("plug")
    ) {
      stateRepository.clearState(userId);
      userState = null;
    }

    // 🟢 STEP 1 — AI SEARCH
    if (!userState || userState.step === "start") {
      const aiData = await parseUserInput(message);

      console.log("AI DATA:", aiData); // 🔍 DEBUG LOG

      // ❌ AI FAILED
      if (!aiData || !aiData.part) {
        return {
          reply:
            "⚠️ Could not understand.\n\nTry like:\nHonda Civic 2016 brake pads",
        };
      }

      const make = aiData.make || "Unknown";
      const model = aiData.model || "";
      const part = aiData.part;

      const products = getMockProducts(part);

      // 💾 SAVE STATE
      stateRepository.setState(userId, {
        step: "awaiting_selection",
        make,
        model,
        part,
        products,
      });

      // 📦 BUILD RESPONSE
      let reply = `🔍 Product Search: ${part}\n🚗 Vehicle: ${make} ${model}\n\nAvailable Options:\n`;

      products.forEach((p) => {
        reply += `${p.id}. ${p.name} - PKR ${p.price}\n`;
      });

      reply += `\nReply with option number to proceed.`;

      return { reply };
    }

    // 🟡 STEP 2 — SELECTION
    if (userState.step === "awaiting_selection") {
      const selectedId = parseInt(message);

      const selectedProduct = userState.products.find(
        (p) => p.id === selectedId
      );

      if (!selectedProduct) {
        return {
          reply: "⚠️ Invalid option. Please reply with a valid number (1 or 2).",
        };
      }

      // 💾 SAVE STATE
      stateRepository.setState(userId, {
        ...userState,
        step: "awaiting_confirmation",
        selectedProduct,
      });

      return {
        reply: `✅ Selected: ${selectedProduct.name}\nPrice: PKR ${selectedProduct.price}\n\nConfirm order? (Yes/No)`,
      };
    }

    // 🔵 STEP 3 — CONFIRMATION
    if (userState.step === "awaiting_confirmation") {
      const msg = message.toLowerCase();

      if (msg === "yes") {
        stateRepository.clearState(userId);

        return {
          reply:
            "🎉 Order confirmed!\nOur team will contact you shortly.",
        };
      }

      if (msg === "no") {
        stateRepository.clearState(userId);

        return {
          reply:
            "❌ Order cancelled.\nYou can search again anytime.",
        };
      }

      return {
        reply: "⚠️ Please reply with Yes or No.",
      };
    }

    // 🔁 FALLBACK RESET
    stateRepository.clearState(userId);

    return {
      reply: "⚠️ Session reset. Please start again.",
    };
  } catch (error) {
    console.error("FLOW ERROR:", error);

    return {
      reply: "⚠️ Server error. Please try again.",
    };
  }
}

module.exports = { autoPartsFlow };
