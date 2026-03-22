module.exports = (products, context = {}) => {

  if (!products || !products.length) return [];

  // Basic ranking (can evolve later)
  let ranked = [...products];

  // Example logic:
  // 1. Prioritize cheaper first
  ranked.sort((a, b) => parseInt(a.price) - parseInt(b.price));

  // 2. Limit results (UX optimization)
  return ranked.slice(0, 3);
};
