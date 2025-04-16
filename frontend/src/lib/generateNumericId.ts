export const generateNumericId = () => {
  return parseInt(Date.now() + '' + Math.floor(Math.random() * 1000));
};
