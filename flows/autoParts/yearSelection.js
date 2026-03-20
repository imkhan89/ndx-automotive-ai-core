const stateRepo = require("../../state/stateRepository");

module.exports = (user, text, state) => {

  state.year = text;
  state.step = "fetch";
  stateRepo.set(user, state);

  const next = require("./productFetch");
  return next(user, "", state);
};
