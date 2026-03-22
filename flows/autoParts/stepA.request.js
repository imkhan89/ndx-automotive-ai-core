const whatsappService = require('../../integrations/whatsappService');

module.exports = async (to) => {
    const message = `Share Auto Parts Inquiry in the following format:

Part Name:
Vehicle Make:
Model Name:
Model Year:

Example:
Air Filter Suzuki Swift 2021

Reply with # for main menu
Reply with * to connect with an agent`;

    return whatsappService.sendMessage(to, message);
};
