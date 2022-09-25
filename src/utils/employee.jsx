export const getCurrentAssignedEmployeeIDs = (employees) => {
  const employeeIDs = new Set();

  employees?.forEach((employee) => {
    employeeIDs.add(employee.attributes.work_id);
  });

  return [...employeeIDs.values()];
};

export const getEmployeeEditData = (
  globalItemHolder,
  first_name,
  last_name,
  employee_id,
  email,
  selected,
  password
) => {
  let editData = {};

  if (globalItemHolder?.attributes?.first_name != first_name)
    editData = { ...editData, first_name: first_name };
  if (globalItemHolder?.attributes?.last_name != last_name)
    editData = { ...editData, last_name: last_name };
  if (globalItemHolder?.attributes?.work_id != employee_id)
    editData = { ...editData, work_id: employee_id };
  if (globalItemHolder?.attributes?.email != email)
    editData = { ...editData, email: email };
  if (globalItemHolder?.relationships?.role?.attributes?.slug != selected.value)
    editData = { ...editData, role: selected.value };
  if (globalItemHolder?.attributes?.password != password)
    editData = { ...editData, password: password };

  return editData;
};
