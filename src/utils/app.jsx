export const classNames = (...classes) => {
  return classes.filter(Boolean).join("");
};

export const generateAvatar = (name, backgroundColor, avatarColor, bold) => {
  return `https://ui-avatars.com/api/?name=${name}&background=${backgroundColor}&color=${avatarColor}&bold=${bold}&font-size=0.33`;
};

export const generateNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const checkIfAnObjectExitsInArray = (
  arrayToCheck,
  arrayWithUniqueIds
) => {
  let object = null;
  arrayWithUniqueIds.forEach((uniqueId) => {
    arrayToCheck.find((arrayElement) => {
      if (arrayElement.value === uniqueId) {
        object = arrayElement;
      }
    });
  });

  return object;
};

export const checkIfAValueExitsInArray = (arrayToCheck, arrayWithUniqueIds) => {
  let value = null;
  arrayWithUniqueIds.forEach((uniqueId) => {
    arrayToCheck.find((arrayElement) => {
      if (arrayElement === uniqueId) {
        value = arrayElement;
      }
    });
  });

  return value;
};
