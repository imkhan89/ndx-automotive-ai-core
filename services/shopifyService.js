// FILE: services/shopifyService.js

const fetch = require("node-fetch");

// ==============================
// 🔥 NORMALIZE
// ==============================
function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

// ==============================
// 🔥 SCORE PRODUCT (FINAL LOGIC)
// ==============================
function scoreProduct(product, query) {
  const title = normalize(product.title);

  let score = 0;

  // 🔧 PART MATCH (PRIMARY - REQUIRED)
  const partWords = query.part.toLowerCase().split(" ");
  const partMatch = partWords.some(word => title.includes(word));

  if (partMatch) {
    score += 60;
  }

  // 🚗 MAKE MATCH (OPTIONAL BOOST)
  if (title.includes(query.make.toLowerCase())) {
    score += 20;
  }

  // 🚘 MODEL MATCH (OPTIONAL BOOST)
  if (title.includes(query.model.toLowerCase())) {
    score += 20;
  }

  return score;
}

// ==============================
// 🔥 FETCH PRODUCTS
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
// 🔍 SEARCH PRODUCTS
// ==============================
async function searchProducts(query) {
  try {
    const STORE_URL = process.env.STORE_URL || "https://ndestore.com";

    if (!query || !query.part) {
      return [];
    }

    const products = await fetchProducts();

    // 🔥 SCORE ALL PRODUCTS
    const scored = products.map(product => ({
      ...product,
      score: scoreProduct(product, query)
    }));

    // 🔥 FILTER (ONLY PART MATCH REQUIRED)
    const matched = scored
      .filter(p => p.score >= 60) // 🔥 KEY CHANGE
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    // 🔥 FORMAT OUTPUT
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
