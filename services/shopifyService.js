// FILE: services/shopifyService.js

const fetch = require("node-fetch");

// ==============================
// 🔧 NORMALIZE
// ==============================
function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

// ==============================
// 🧠 SCORE PRODUCT
// ==============================
function scoreProduct(product, query) {
  const title = normalize(product.title);

  let score = 0;

  const partWords = query.part.toLowerCase().split(" ");
  const partMatch = partWords.some(word => title.includes(word));

  if (partMatch) score += 60;
  if (title.includes(query.make.toLowerCase())) score += 20;
  if (title.includes(query.model.toLowerCase())) score += 20;

  return score;
}

// ==============================
// 🔄 FETCH PRODUCTS (DEBUG MODE)
// ==============================
async function fetchProducts() {
  const SHOP = process.env.SHOPIFY_STORE_URL;
  const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

  let allProducts = [];
  let url = `https://${SHOP}/admin/api/2023-10/products.json?limit=250`;

  console.log("🌐 Shopify Store:", SHOP);
  console.log("🔑 Token Exists:", !!TOKEN);

  try {
    while (url) {
      console.log("➡️ Fetching URL:", url);

      const response = await fetch(url, {
        headers: {
          "X-Shopify-Access-Token": TOKEN,
          "Content-Type": "application/json"
        }
      });

      console.log("📡 Response Status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Shopify API Error:", errorText);
        break;
      }

      const data = await response.json();

      console.log(
        "📦 Products fetched in this batch:",
        data.products ? data.products.length : 0
      );

      allProducts = allProducts.concat(data.products || []);

      // 🔥 PAGINATION
      const linkHeader = response.headers.get("link");

      if (linkHeader && linkHeader.includes('rel="next"')) {
        const match = linkHeader.match(/<([^>]+)>; rel="next"/);
        url = match ? match[1] : null;
      } else {
        url = null;
      }
    }

    console.log("✅ TOTAL PRODUCTS FETCHED:", allProducts.length);

    return allProducts;

  } catch (error) {
    console.error("❌ Shopify Fetch Error:", error);
    return [];
  }
}

// ==============================
// 🔍 SEARCH PRODUCTS
// ==============================
async function searchProducts(query) {
  try {
    console.log("🔍 SEARCH QUERY:", query);

    if (!query || !query.part) {
      console.log("❌ Invalid query");
      return [];
    }

    const products = await fetchProducts();

    console.log("📊 TOTAL PRODUCTS RECEIVED:", products.length);

    const scored = products.map(product => ({
      ...product,
      score: scoreProduct(product, query)
    }));

    const matched = scored
      .filter(p => p.score >= 60)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    console.log("✅ MATCHED PRODUCTS:", matched.length);

    return matched.map(product => ({
      id: product.id,
      title: product.title,
      price: product.variants?.[0]?.price || "N/A",
      image: product.image?.src || null,
      url: `https://ndestore.com/products/${product.handle}`
    }));

  } catch (error) {
    console.error("❌ Search Error:", error);
    return [];
  }
}

module.exports = {
  searchProducts
};
