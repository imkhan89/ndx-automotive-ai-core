const send = require("../../services/whatsappService").send;
const productListTemplate = require("../../interface/templates/productListTemplate");

module.exports = (user, text, state) => {

  return send(user, productListTemplate(state.products));
};
