const whatsappService = require('./whatsappService');
const sessionManager = require('../system/sessionManager');

module.exports = async (from) => {

    sessionManager.updateSession(from, { botPaused: true });

    const adminMessage = `CUSTOMER WANTS TO CHAT WITH LIVE AGENT
Whatsapp Number: ${from}`;

    await whatsappService.sendMessage("923214222294", adminMessage);

    return whatsappService.sendMessage(from, "You are being connected to an agent.");
};
