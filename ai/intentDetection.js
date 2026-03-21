module.exports = (text = "") => {

  const t = text.toLowerCase();

  if (t.includes("filter")) return "autoParts";
  if (t.includes("brake")) return "autoParts";
  if (t.includes("order")) return "orders";
  if (t.includes("complaint")) return "complaint";

  return "unknown";
};
