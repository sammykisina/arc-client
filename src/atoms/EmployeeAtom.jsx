import { atom } from "recoil";

export const allEmployeesFromDBState = atom({
  key: "allEmployeesFromDBState",
  default: [],
});

export const isEditingEmployeeState = atom({
  key: "isEditingEmployeeState",
  default: false,
});

export const globalEmployeeState = atom({
  key: "globalEmployeeState",
  default: null,
});
