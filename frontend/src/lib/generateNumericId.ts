export const generateNumericId = () => {
  return parseInt(Date.now() + '' + Math.floor(Math.random() * 1000));
};

export const generateStringId = () => {
  return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
};
