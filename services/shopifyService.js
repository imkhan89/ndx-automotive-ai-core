const axios = require("axios");

const SHOP = process.env.SHOPIFY_STORE_URL;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

// 🔥 OPTIONAL: synonym mapping (improves search accuracy)
const synonyms = {
  "air filter": ["air filter", "air cleaner", "engine air filter"],
  "oil filter": ["oil filter", "engine oil filter"],
  "brake pad": ["brake pad", "brake pads"],
};

function expandQuery(query) {
  const lower = query.toLowerCase();

  for (let key in synonyms) {
    if (lower.includes(key)) {
      return synonyms[key];
    }
  }

  return lower.split(" ");
}

async function searchProducts(query) {
  try {
    console.log("🔍 Shopify Search Query:", query);

    const response = await axios.get(
      `https://${SHOP}/admin/api/2024-01/products.json`,
      {
        headers: {
          "X-Shopify-Access-Token": TOKEN,
          "Content-Type": "application/json",
        },
        params: {
          limit: 50, // fetch more for better matching
        },
      }
    );

    const products = response.data.products;

    if (!products || products.length === 0) {
      console.log("⚠️ No products returned from Shopify");
      return [];
    }

    const keywords = expandQuery(query);

    console.log("🔑 Keywords:", keywords);

    const filtered = products.filter((product) => {
      const title = product.title.toLowerCase();

      return keywords.some((word) => title.includes(word));
    });

    console.log("✅ Filtered Products Count:", filtered.length);

    // Normalize output (important for flow consistency)
    const cleaned = filtered.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.variants?.[0]?.price || "0",
      url: `https://${SHOP}/products/${p.handle}`,
    }));

    return cleaned.slice(0, 2); // return top 2
  } catch (error) {
    console.error("❌ Shopify Error:", error.response?.data || error.message);
    return [];
  }
}

module.exports = { searchProducts };
