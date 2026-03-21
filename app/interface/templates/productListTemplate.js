module.exports = (products) => {

  const list = products
    .map((p, i) => `${i + 1}. ${p.title} - ${p.price}`)
    .join("\n");

  return `Available Products:

${list}

Reply with number`;
};
