const { processQuery } = require("../core/queryEngine");
const { sendWhatsAppMessage } = require("../services/whatsappService");

exports.handleWebhook = async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;
    const text = message.text?.body || "";

    console.log("💬 Incoming:", text);

    // 🔹 Process via Query Engine
    const result = await processQuery(text);

    let reply = "";

    // 🔹 Greeting / normal text
    if (result.type === "text") {
      reply = result.reply;
    }

    // 🔹 Product search response
    if (result.type === "product_search") {
      const data = result.data;

      reply = `
🚗 Vehicle: ${data.vehicle || "Not detected"}
🔧 Part: ${data.part || "Not detected"}

📍 Position:
Front: ${data.position?.front || false}
Rear: ${data.position?.rear || false}
Left: ${data.position?.left || false}
Right: ${data.position?.right || false}
Upper: ${data.position?.upper || false}
Lower: ${data.position?.lower || false}
Inner: ${data.position?.inner || false}
Outer: ${data.position?.outer || false}

❌ No Product Found
`;
    }

    // 🔹 Send reply
    await sendWhatsAppMessage(from, reply);

    res.sendStatus(200);

  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    res.sendStatus(500);
  }
};
