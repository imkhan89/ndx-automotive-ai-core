module.exports = (products) => {
  const list = products
    .map((p, i) => `${i + 1}. ${p.title} - ${p.price}`)
    .join("\n");

  return `Available Products:\n\n${list}\n\nReply with number`;
};
