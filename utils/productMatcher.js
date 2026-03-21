const productMap = require("./productMap");

const findProductMatch = (message) => {
  const text = message.toLowerCase();

  for (const vehicle of productMap) {
    const vehicleMatch = vehicle.keywords.some((k) =>
      text.includes(k)
    );

    if (vehicleMatch) {
      for (const product of vehicle.products) {
        const productMatch = product.keywords.some((k) =>
          text.includes(k)
        );

        if (productMatch) {
          return product;
        }
      }
    }
  }

  return null;
};

module.exports = {
  findProductMatch,
};
