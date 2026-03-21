const axios = require("axios");

// ===============================
// 🔹 SEND TEXT MESSAGE FUNCTION
// ===============================
const sendTextMessage = async (to, message) => {
  try {
    const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;

    const response = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: to,
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ WhatsApp API Response:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "❌ WhatsApp Send Error:",
      error.response?.data || error.message
    );

    return null;
  }
};

module.exports = {
  sendTextMessage,
};
