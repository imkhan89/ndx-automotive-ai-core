module.exports = (product) => {
  return `Confirm Order:

${product.title}
${product.displayPrice || product.price}

Reply YES to confirm`;
};
