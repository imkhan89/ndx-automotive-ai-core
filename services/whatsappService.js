const axios = require("axios");

const sendTextMessage = async (to, message) => {
  try {
    const url = `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`;

    console.log("🚀 Sending WhatsApp message...");
    console.log("To:", to);
    console.log("Message:", message);

    const res = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: to,
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ WhatsApp Sent:", res.data);

    return res.data;

  } catch (error) {
    console.error("❌ WhatsApp ERROR:");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error(error.message);
    }

    return null;
  }
};

module.exports = {
  sendTextMessage,
};
