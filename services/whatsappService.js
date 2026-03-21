const axios = require("axios");

const sendWhatsAppMessage = async (to, message) => {
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: {
          body: message
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Message sent");

  } catch (error) {
    console.error("❌ WhatsApp Error:", error.response?.data || error.message);
  }
};

module.exports = {
  sendWhatsAppMessage
};
