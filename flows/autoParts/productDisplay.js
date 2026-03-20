const send = require("../../services/whatsappService").send;

module.exports = (user, text, state) => {

  const list = state.products
    .map((p, i) => `${i + 1}. ${p.title} - ${p.price}`)
    .join("\n");

  return send(user, `Available Products:\n\n${list}\n\nReply with number`);
};
