const axios = require("axios");

const SHOP = process.env.SHOPIFY_STORE_URL;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

async function searchProducts(query) {
  try {
    const response = await axios.get(
      `https://${SHOP}/admin/api/2024-01/products.json`,
      {
        headers: {
          "X-Shopify-Access-Token": TOKEN,
        },
        params: {
          limit: 10,
        },
      }
    );

    const products = response.data.products;

    // Simple filter
    const filtered = products.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );

    return filtered.slice(0, 2);
  } catch (error) {
    console.error("Shopify Error:", error.message);
    return [];
  }
}

module.exports = { searchProducts };
