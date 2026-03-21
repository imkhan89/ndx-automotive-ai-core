const productMap = require("./productMap");

const matchProduct = async ({ make, model, year, part, position }) => {
  if (!part) return null;

  for (const vehicle of productMap) {

    const vehicleMatch =
      (!make || vehicle.make?.toLowerCase() === make?.toLowerCase()) &&
      (!model || vehicle.model?.toLowerCase() === model?.toLowerCase());

    if (!vehicleMatch) continue;

    for (const product of vehicle.products) {

      const partMatch = product.part?.toLowerCase() === part;

      if (!partMatch) continue;

      // Optional position filtering
      if (product.position) {
        const matchPosition = Object.keys(position || {}).every(key => {
          return !product.position[key] || position[key];
        });

        if (!matchPosition) continue;
      }

      return product;
    }
  }

  return null;
};

module.exports = {
  matchProduct
};
