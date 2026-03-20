// FILE: services/shopifyService.js

const fetch = require("node-fetch");

// 🔥 PART DICTIONARY (CORE ENGINE)
const PART_DICTIONARY = {
  "air filter": ["air filter", "air filter element"],
  "oil filter": ["oil filter"],
  "ac filter": ["ac filter", "cabin filter"],
  "spark plug": ["spark plug", "plug"],
  "headlight": ["head light", "headlight"],
  "fog light": ["fog light"],
  "back light": ["back light", "tail light"],
  "radiator": ["radiator"],
  "radiator bottle": ["radiator bottle", "coolant tank"],
  "engine mounting": ["engine mounting", "engine mount"],
  "control arm": ["control arm"],
  "tie rod end": ["tie rod end"],
  "ball joint": ["ball joint"],
  "bumper": ["bumper"],
  "fender liner": ["fender liner"],
  "fender shield": ["fender shield"],
  "fender clip": ["fender clip"],
  "door handle": ["door handle"],
  "side mirror": ["side mirror", "mirror"],
  "monogram emblem": ["monogram", "emblem"]
};

// 🔥 REMOVE BRAND / VARIANTS
function cleanPartName(part) {
  return part
    .replace(/denso|genuine|imported|original|oem/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

// 🔥 NORMALIZE TEXT
function normalize(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

// 🔥 EXTRACT PART FROM TITLE (POSITION BASED)
function extractPartFromTitle(title) {
  const lowerTitle = title.toLowerCase();

  if (!lowerTitle.includes(" for ")) return null;

  const partSection = lowerTitle.split(" for ")[0];

  return cleanPartName(partSection);
}

// 🔥 MATCH PART USING DICTIONARY
function matchPart(queryPart, productPart) {
  const normalizedQuery = normalize(queryPart);

  const validParts = PART_DICTIONARY[normalizedQuery] || [normalizedQuery];

  return validParts.some(p => productPart.includes(p));
}

// 🔥 MAIN MATCH FUNCTION
function isMatch(product, query) {
  const title = product.title.toLowerCase();

  const productPart = extractPartFromTitle(title);

  if (!productPart) return false;

  const partMatch = matchPart(query.part, productPart);
  const makeMatch = title.includes(query.make.toLowerCase());
  const modelMatch = title.includes(query.model.toLowerCase());

  return partMatch && makeMatch && modelMatch;
}

// 🔥 FETCH PRODUCTS FROM SHOPIFY
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

// 🔥 MAIN SEARCH FUNCTION
async function searchProducts(query) {
  const products = await fetchProducts();

  const matched = products.filter(product => isMatch(product, query));

  // 🔥 FORMAT RESULTS
  return matched.map(product => ({
    id: product.id,
    title: product.title,
    price: product.variants[0]?.price || "N/A",
    image: product.image?.src || null
  }));
}

module.exports = {
  searchProducts
};
