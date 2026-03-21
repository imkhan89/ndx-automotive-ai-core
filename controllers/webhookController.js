const { processQuery } = require("../core/queryEngine");
const { sendWhatsAppMessage } = require("../services/whatsappService");

// 🔴 TEMP MEMORY (later DB/Redis)
const userState = {};

exports.handleWebhook = async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;
    const text = message.text?.body || "";

    console.log("💬 Incoming:", text);

    // 🔹 Get user state
    if (!userState[from]) {
      userState[from] = {};
    }

    const state = userState[from];

    // 🔹 Process
    const result = await processQuery(text, state);

    let reply = "";

    // ✅ MAIN MENU (FORCED FIRST)
    if (result.type === "menu") {

      reply = `Main Menu:

1. Auto Parts
2. Accessories
3. Decal Stickers
4. Order Status
5. Complaint
6. Chat Support

Reply with number`;

      state.step = "menu"; // 🔴 LOCK USER INTO FLOW
    }

    // ✅ MENU SELECTION
    else if (state.step === "menu") {

      if (text === "1") {
        reply = "🚗 Please enter your car make, model and required part";
        state.step = "auto_parts";
      }

      else {
        reply = "❌ Invalid option. Please reply with a number (1-6)";
      }
    }

    // ✅ AUTO PARTS FLOW (AI ENABLED HERE)
    else if (state.step === "auto_parts") {

      const data = result.data;

      reply = `
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

    await sendWhatsAppMessage(from, reply);

    res.sendStatus(200);

  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    res.sendStatus(500);
  }
};
