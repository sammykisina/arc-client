export const classNames = (...classes) => {
  return classes.filter(Boolean).join("");
};

export const generateAvatar = (name, backgroundColor, avatarColor, bold) => {
  return `https://ui-avatars.com/api/?name=${name}&background=${backgroundColor}&color=${avatarColor}&bold=${bold}`;
};

/**
 *
 * @param int number
 * @returns  string
 */
export const generateNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const getEmployeeTitle = (role) => {
  let title = "";

  role === "admin" || role === "bartender" || role == "waiter"
    ? (title = "Employee")
    : role === "super-admin"
    ? (title = "Owner")
    : role === "supplier"
    ? "Supper"
    : "Customer";

  return title;
};

export const getEmployeeRoleName = (role) => {
  let roleName = "";

  if (role === "admin") roleName = "Administrator";
  else if (role === "super-admin") roleName = "Super Admin";
  else if (role === "bartender") roleName = "Bartender";
  else if (role === "supplier") roleName = "Supplier";
  else roleName = "Customer";

  return roleName;
};
