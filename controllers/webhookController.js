const { processQuery } = require("../core/queryEngine");
const sendWhatsAppMessage = require("../services/whatsappService");

exports.handleWebhook = async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;
    const text = message.text?.body || "";

    console.log("💬 Incoming:", text);

    // ✅ Use query engine
    const result = await processQuery(text);

    let reply = "";

    if (result.type === "text") {
      reply = result.reply;
    }

    if (result.type === "product_search") {
      const data = result.data;

      reply = `
🚗 Vehicle: ${data.vehicle || "Not detected"}
🔧 Part: ${data.part || "Not detected"}

📍 Position:
Front: ${data.position.front}
Rear: ${data.position.rear}
Left: ${data.position.left}
Right: ${data.position.right}

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
