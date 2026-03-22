const whatsappService = require('../../integrations/whatsappService');

module.exports = async (to, data) => {
    const message = `Kindly confirm 

Part Name: ${data.partName}
Vehicle Make: ${data.make}
Model Name: ${data.model}
Model Year: ${data.year}

Reply with 
1 Confirm
2 Inaccurate

Reply with # for main menu
Reply with * to connect with an agent`;

    return whatsappService.sendMessage(to, message);
};
