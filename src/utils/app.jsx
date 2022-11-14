export const classNames = (...classes) => {
  return classes.filter(Boolean).join("");
};

export const generateAvatar = (name, backgroundColor, avatarColor, bold) => {
  return `https://ui-avatars.com/api/?name=${name}&background=${backgroundColor}&color=${avatarColor}&bold=${bold}&font-size=0.33`;
};

export const generateNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const checkIfExitsInArray = (array, item) => {
  let value = null;
  array?.find((arrayItem) => {
    if (arrayItem?.name.toLowerCase() === item.toLowerCase()) {
      value = arrayItem;
    }
  });

  return value;
};

export const formatDate = (date) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

// export const checkIfAValueExitsInArray = (arrayToCheck, arrayWithUniqueIds) => {
//   let value = null;
//   arrayWithUniqueIds.forEach((uniqueId) => {
//     arrayToCheck.find((arrayElement) => {
//       if (arrayElement === uniqueId) {
//         value = arrayElement;
//       }
//     });
//   });

//   return value;
// };

// export const checkIfExitsInArray = (arrayToCheck, arrayWithKeys, key) => {
//   let value = null;

//   if (arrayWithKeys?.length > 0) {
//     arrayWithKeys.forEach((key) => {
//       arrayToCheck.find((element) => {
//         /**
//          * element = {
//          * name: ""
//          * value: ""
//          * }
//          */
//         if (element.value && element.value === key) {
//         } else {
//         }
//       });
//     });
//   }
// };
