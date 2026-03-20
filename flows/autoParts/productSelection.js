const send = require("../../services/whatsappService").send;
const stateRepo = require("../../state/stateRepository");

module.exports = (user, text, state) => {

  const product = state.products[text - 1];

  if (!product) {
    return send(user, "Invalid selection. Try again.");
  }

  state.selected = product;
  state.step = "confirm";
  stateRepo.set(user, state);

  return send(user,
`Confirm Order:

${product.title}
${product.price}

Reply YES to confirm`
  );
};
