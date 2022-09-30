export const classNames = (...classes) => {
  return classes.filter(Boolean).join("");
};

export const generateAvatar = (name, backgroundColor, avatarColor, bold) => {
  return `https://ui-avatars.com/api/?name=${name}&background=${backgroundColor}&color=${avatarColor}&bold=${bold}&font-size=0.33`;
};

export const generateNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
