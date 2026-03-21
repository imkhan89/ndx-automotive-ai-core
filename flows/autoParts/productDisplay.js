const send = require("../../services/whatsappService").send;
const template = require("../../interface/templates/productListTemplate");

module.exports = (user, text, state) => {

  return send(user, template(state.products));
};
