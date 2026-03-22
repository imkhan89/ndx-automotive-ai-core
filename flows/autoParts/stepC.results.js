const whatsappService = require('../../integrations/whatsappService');
const sessionManager = require('../../system/sessionManager');

module.exports = async (from) => {
    const session = sessionManager.getSession(from);
    const { partName, make, model, year } = session.data;

    // TODO: Replace with Shopify API
    const message = `${partName} for ${make} ${model} ${year} visit the following website links:

1. Sample Product
https://ndestore.com/product-1

2. Sample Product
https://ndestore.com/product-2

3. Sample Product
https://ndestore.com/product-3

Reply with # for main menu
Reply with * to connect with an agent`;

    return whatsappService.sendMessage(from, message);
};
