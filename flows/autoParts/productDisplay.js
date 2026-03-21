function buildProductReply(products) {
  let message = "🔍 *Top Matches Found:*\n\n";

  products.slice(0, 3).forEach((p, i) => {
    message += `${i + 1}️⃣ ${p.title}\n💰 Rs.${p.price}\n\n`;
  });

  message += `🔥 Fast moving items\n`;
  message += `👉 Reply 1, 2 or 3 to select\n`;
  message += `👉 Reply *ORDER* to confirm\n`;

  return message;
}

module.exports = { buildProductReply };
