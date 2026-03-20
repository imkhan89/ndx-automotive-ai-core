const send = require("../../services/whatsappService").send;
const stateRepo = require("../../state/stateRepository");

module.exports = (user, text, state) => {

  if (state.step === "category") {
    state.step = "productType";
    stateRepo.set(user, state);

    return send(user,
`Select Auto Part:
1. Air Filter
2. Oil Filter
3. Brake Parts`
    );
  }

  if (state.step === "productType") {
    state.productType = text;
    state.step = "end";

    stateRepo.set(user, state);

    return send(user, `Selected: ${text}`);
  }
};
