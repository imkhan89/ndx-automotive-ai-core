function whatsappFormatter(type, data, state) {

  // 🔴 MAIN MENU
  if (type === "menu") {
    state.step = "menu";

    return `Main Menu:

1. Auto Parts
2. Accessories
3. Decal Stickers
4. Order Status
5. Complaint
6. Chat Support

Reply with number`;
  }

  // 🔴 MENU SELECTION
  if (type === "menu_selection") {

    if (data === "1") {
      state.step = "auto_parts";
      return "🚗 Please enter your car make, model and required part";
    }

    return "❌ Invalid option. Reply with number (1-6)";
  }

  // 🔴 PRODUCT RESULT
  if (type === "product_result") {
    return `
🚗 Vehicle: ${data.vehicle || "Not detected"}
🔧 Part: ${data.part || "Not detected"}

📍 Position:
Front: ${data.position?.front || false}
Rear: ${data.position?.rear || false}
Left: ${data.position?.left || false}
Right: ${data.position?.right || false}

❌ No Product Found
`;
  }

  return "⚠️ Something went wrong";
}

module.exports = { whatsappFormatter };
