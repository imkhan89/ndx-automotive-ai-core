const axios = require("axios");

const sendTextMessage = async (to, message) => {
  try {
    const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;

    const res = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;

  } catch (error) {
    console.error("WhatsApp error:", error.response?.data || error.message);
  }
};

module.exports = { sendTextMessage };
