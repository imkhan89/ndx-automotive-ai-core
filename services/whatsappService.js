const axios = require("axios");

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// ✅ TEXT MESSAGE
const sendWhatsAppMessage = async (to, message) => {
  try {
    console.log("📤 Sending WhatsApp message:", message);

    await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Message sent successfully");
  } catch (error) {
    console.error(
      "❌ WhatsApp Send Error:",
      error.response?.data || error.message
    );
  }
};

// ✅ BUTTON MESSAGE (future ready)
const sendButtons = async (to, bodyText, buttons = []) => {
  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "interactive",
        interactive: {
          type: "button",
          body: { text: bodyText },
          action: {
            buttons: buttons.map((btn, i) => ({
              type: "reply",
              reply: {
                id: `btn_${i}`,
                title: btn,
              },
            })),
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("❌ Button Send Error:", error.response?.data || error.message);
  }
};

// ✅ LIST MESSAGE (future ready)
const sendList = async (to, bodyText, sections = []) => {
  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "interactive",
        interactive: {
          type: "list",
          body: { text: bodyText },
          action: {
            button: "View Options",
            sections,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("❌ List Send Error:", error.response?.data || error.message);
  }
};

module.exports = {
  sendWhatsAppMessage,
  sendButtons,
  sendList,
};
