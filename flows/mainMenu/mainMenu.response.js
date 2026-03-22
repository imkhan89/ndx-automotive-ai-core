const whatsappService = require('../../integrations/whatsappService');

module.exports = async (to) => {
    const message = `Welcome to ndestore.com, to proceed with an inquiry proceed with any of the following options:

1. Auto Parts
2. Car Accessories
3. Sticker Decals
4. Order Status
5. Chat Support
6. Complaints

Reply with 1-6 to continue.`;

    return whatsappService.sendMessage(to, message);
};
