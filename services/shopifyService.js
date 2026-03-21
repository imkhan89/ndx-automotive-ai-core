const axios = require("axios");

const searchProducts = async (query) => {
  try {
    const url = `https://${process.env.SHOPIFY_STORE}/admin/api/2023-10/products.json`;

    const res = await axios.get(url, {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_TOKEN,
      },
    });

    const products = res.data.products;

    return products.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);

  } catch (err) {
    console.error("Shopify error:", err.message);
    return [];
  }
};

module.exports = { searchProducts };
