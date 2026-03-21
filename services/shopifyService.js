// FILE: services/shopifyService.js

const fetch = require("node-fetch");

// ==============================
// 🔥 NORMALIZE TEXT
// ==============================
function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

// ==============================
// 🔥 SCORE PRODUCT (SMART MATCH)
// ==============================
function scoreProduct(product, query) {
  const title = product.title.toLowerCase();

  let score = 0;

  // 🔧 PART MATCH (MOST IMPORTANT)
  const partKeywords = query.part.toLowerCase().split(" ");
  const partMatch = partKeywords.every(word => title.includes(word));

  if (partMatch) {
    score += 50;
  }

  // 🚗 MAKE MATCH
  if (title.includes(query.make.toLowerCase())) {
    score += 25;
  }

  // 🚘 MODEL MATCH
  if (title.includes(query.model.toLowerCase())) {
    score += 25;
  }

  return score;
}

// ==============================
// 🔥 FETCH PRODUCTS FROM SHOPIFY
// ==============================
async function fetchProducts() {
  const SHOP = process.env.SHOPIFY_STORE_URL;
  const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

  const url = `https://${SHOP}/admin/api/2023-10/products.json?limit=250`;

  const response = await fetch(url, {
    headers: {
      "X-Shopify-Access-Token": TOKEN,
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();

  return data.products || [];
}

// ==============================
// 🔍 MAIN SEARCH FUNCTION
// ==============================
async function searchProducts(query) {
  try {
    const STORE_URL = process.env.STORE_URL || "https://ndestore.com";

    if (!query || !query.part || !query.make || !query.model) {
      return [];
    }

    const products = await fetchProducts();

    // 🔥 SCORE ALL PRODUCTS
    const scored = products.map(product => ({
      ...product,
      score: scoreProduct(product, query)
    }));

    // 🔥 FILTER + SORT
    const matched = scored
      .filter(p => p.score >= 50) // 🔥 KEY FIX
      .sort((a, b) => b.score - a.score);

    // 🔥 FORMAT RESPONSE
    return matched.map(product => ({
      id: product.id,
      title: product.title,
      price: product.variants?.[0]?.price || "N/A",
      image: product.image?.src || null,
      url: `${STORE_URL}/products/${product.handle}`
    }));

  } catch (error) {
    console.error("❌ Shopify Search Error:", error);
    return [];
  }
}

module.exports = {
  searchProducts
};
