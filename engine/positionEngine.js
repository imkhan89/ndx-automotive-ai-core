const extractPosition = (text = "") => {
  const t = text.toLowerCase();

  return {
    front: t.includes("front"),
    rear: t.includes("rear"),
    left: t.includes("left"),
    right: t.includes("right"),
    lower: t.includes("lower"),
    upper: t.includes("upper"),
    inner: t.includes("inner"),
    outer: t.includes("outer")
  };
};

module.exports = {
  extractPosition
};
