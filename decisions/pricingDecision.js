const { isInternational } = require("../utils/countryDetector");

module.exports = (user, product) => {

  if (!product) return product;

  const intl = isInternational(user);

  return {
    ...product,
    displayPrice: intl
      ? `$${product.usdPrice || product.price}`
      : `Rs. ${product.price}`
  };
};
