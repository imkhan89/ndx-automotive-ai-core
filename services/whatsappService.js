const axios = require("axios");

const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

async function sendTextMessage(to, message) {
  try {
    console.log("📡 Sending to WhatsApp:", to);

    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ WhatsApp Response:", response.data);

    return response.data;

  } catch (error) {
    console.error("❌ WhatsApp API ERROR:");
    console.error(JSON.stringify(error.response?.data, null, 2));

    return null;
  }
}

module.exports = { sendTextMessage };
