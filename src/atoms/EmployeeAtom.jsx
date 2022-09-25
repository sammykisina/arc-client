import { atom } from "recoil";

/**
 * all employees from the database
 */
export const allEmployeesFromDBState = atom({
  key: "allEmployeesFromDBState",
  default: [],
});

// is adding employee states
export const isAddingEmployeeState = atom({
  key: "isAddingEmployeeState",
  default: false,
});

// is editing employee states
export const isEditingEmployeeState = atom({
  key: "isEditingEmployeeState",
  default: false,
});
