module.exports = (value, type) => {

  if (!value) return false;

  if (type === "number") {
    return !isNaN(parseInt(value));
  }

  if (type === "text") {
    return value.trim().length > 0;
  }

  return true;
};
