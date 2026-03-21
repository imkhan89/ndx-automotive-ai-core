const axios = require("axios");

const STORE = process.env.SHOPIFY_STORE_URL;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

async function searchProducts(query) {
  try {
    const url = `https://${STORE}/admin/api/2023-10/products.json?limit=250`;

    const res = await axios.get(url, {
      headers: {
        "X-Shopify-Access-Token": TOKEN,
      },
    });

    const products = res.data.products;

    return products
      .filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase())
      )
      .map(p => ({
        title: p.title,
        price: p.variants[0].price,
      }));

  } catch (error) {
    console.error("Shopify Error:", error.message);
    return [];
  }
}

module.exports = { searchProducts };
