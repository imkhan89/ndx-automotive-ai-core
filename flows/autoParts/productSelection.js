const send = require("../../services/whatsappService").send;
const stateRepo = require("../../state/stateRepository");

const confirmationTemplate = require("../../interface/templates/confirmationTemplate");
const errorTemplate = require("../../interface/templates/errorTemplate");

module.exports = (user, text, state) => {

  const index = parseInt(text) - 1;
  const product = state.products[index];

  // Validation
  if (!product) {
    return send(user, errorTemplate.invalidSelection());
  }

  // Store selected product
  state.selected = product;

  // Move to next step
  state.step = "confirm";
  stateRepo.set(user, state);

  return send(user, confirmationTemplate(product));
};
