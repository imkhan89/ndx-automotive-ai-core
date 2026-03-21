module.exports = (input, optionsLength) => {

  const index = Number(input);

  if (!index || index < 1 || index > optionsLength) {
    return false;
  }

  return true;
};
