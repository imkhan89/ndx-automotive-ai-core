module.exports = (products = []) => {

  if (!Array.isArray(products)) return [];

  // MVP logic: limit to top 3
  return products.slice(0, 3);
};
