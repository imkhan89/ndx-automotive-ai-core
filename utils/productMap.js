const productDatabase = [
  {
    vehicle: ["corolla"],
    products: [
      {
        name: "Denso Air Filter Corolla 2008-2026",
        keywords: ["air filter", "filter"],
        price: "PKR 2,500",
        link: "https://ndestore.com/products/denso-air-filter-corolla-2008-2026",
        upsell: {
          name: "Toyota Oil Filter",
          price: "PKR 1,200",
          link: "https://ndestore.com/products/toyota-oil-filter",
        },
      },
      {
        name: "Brake Pads Corolla",
        keywords: ["brake", "brake pads"],
        price: "PKR 4,500",
        link: "https://ndestore.com/products/corolla-brake-pads",
        upsell: {
          name: "Brake Cleaner Spray",
          price: "PKR 900",
          link: "https://ndestore.com/products/brake-cleaner",
        },
      },
    ],
  },

  {
    vehicle: ["civic"],
    products: [
      {
        name: "Air Filter Honda Civic",
        keywords: ["air filter", "filter"],
        price: "PKR 2,800",
        link: "https://ndestore.com/products/civic-air-filter",
        upsell: {
          name: "Honda Oil Filter",
          price: "PKR 1,300",
          link: "https://ndestore.com/products/honda-oil-filter",
        },
      },
      {
        name: "Brake Pads Civic",
        keywords: ["brake", "brake pads"],
        price: "PKR 5,000",
        link: "https://ndestore.com/products/civic-brake-pads",
      },
    ],
  },
];

// ===============================
// 🔹 MATCH ENGINE (SMART)
// ===============================
const findProductMatch = (message) => {
  const text = message.toLowerCase();

  for (const vehicle of productDatabase) {
    const vehicleMatch = vehicle.vehicle.some(v => text.includes(v));

    if (vehicleMatch) {
      for (const product of vehicle.products) {
        const productMatch = product.keywords.some(k =>
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
