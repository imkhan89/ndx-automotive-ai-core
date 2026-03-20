const { parseUserInput } = require("../../services/aiParser");

async function autoPartsFlow(userMessage, userState) {
  try {
    console.log("USER MESSAGE:", userMessage);

    // Step 1: If selecting option
    if (userState.step === "SELECT_OPTION") {
      if (userMessage === "1") {
        userState.selectedProduct = "Genuine Air Filter";
        userState.price = 2500;
      } else if (userMessage === "2") {
        userState.selectedProduct = "Aftermarket Air Filter";
        userState.price = 1800;
      } else {
        return "❌ Invalid option. Please select 1 or 2.";
      }

      userState.step = "CONFIRM_ORDER";

      return `✅ Selected: ${userState.selectedProduct}
Price: PKR ${userState.price}

Confirm order? (Yes/No)`;
    }

    // Step 2: Confirm order
    if (userState.step === "CONFIRM_ORDER") {
      if (userMessage.toLowerCase() === "yes") {
        userState.step = "COMPLETED";

        return "🎉 Order confirmed!\nOur team will contact you shortly.";
      } else {
        userState.step = "START";
        return "❌ Order cancelled. Start again.";
      }
    }

    // Step 3: New search
    const aiData = await parseUserInput(userMessage);

    console.log("AI DATA:", aiData);

    if (!aiData) {
      return "⚠️ Could not understand. Please try again.";
    }

    const make = aiData.make || "Unknown";
    const model = aiData.model || "";
    const part = aiData.part || "";

    // 🔥 FIX: NO YEAR REQUIRED
    if (!make || !model || !part) {
      return `Please provide:
Make Model Product

Example:
Honda Civic brake pads`;
    }

    userState.step = "SELECT_OPTION";

    return `🔍 Product Search: ${part}
🚗 Vehicle: ${make} ${model}

Available Options:
1. Genuine ${part} - PKR 2500
2. Aftermarket ${part} - PKR 1800

Reply with option number to proceed.`;
  } catch (error) {
    console.error("FLOW ERROR:", error);
    return "⚠️ Server error. Please try again.";
  }
}

module.exports = { autoPartsFlow };
