const axios = require("axios");

// ===============================
// 🔹 CONFIG
// ===============================
const SHOPIFY_STORE = process.env.SHOPIFY_STORE; 
const SHOPIFY_TOKEN = process.env.SHOPIFY_TOKEN;

// Example:
// SHOPIFY_STORE=ndestore.myshopify.com
// SHOPIFY_TOKEN=shpat_xxxxx

// ===============================
// 🔹 SEARCH PRODUCTS (LIVE)
// ===============================
const searchProducts = async (query) => {
  try {
    const url = `https://${SHOPIFY_STORE}/admin/api/2023-10/products.json`;

    const response = await axios.get(url, {
      headers: {
        "X-Shopify-Access-Token": SHOPIFY_TOKEN,
      },
      params: {
        limit: 50,
      },
    });

    const products = response.data.products;

    // 🔍 Basic filtering (can be improved with AI later)
    const matched = products.filter((product) =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );

    return matched.slice(0, 3); // return top 3

  } catch (error) {
    console.error("❌ Shopify Error:", error.response?.data || error.message);
    return [];
  }
};

module.exports = {
  searchProducts,
};
