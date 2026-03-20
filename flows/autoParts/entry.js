const category = require("./categorySelection");
const make = require("./makeSelection");
const model = require("./modelSelection");
const year = require("./yearSelection");
const fetch = require("./productFetch");
const display = require("./productDisplay");
const select = require("./productSelection");
const confirm = require("./orderConfirmation");
const customer = require("./customerInput");
const create = require("./orderCreation");
const success = require("./orderSuccess");

module.exports = (user, text, state) => {

  switch (state.step) {
    case "category": return category(user, text, state);
    case "make": return make(user, text, state);
    case "model": return model(user, text, state);
    case "year": return year(user, text, state);
    case "fetch": return fetch(user, text, state);
    case "display": return display(user, text, state);
    case "select": return select(user, text, state);
    case "confirm": return confirm(user, text, state);
    case "customer": return customer(user, text, state);
    case "create": return create(user, text, state);
    case "success": return success(user, text, state);
  }
};
