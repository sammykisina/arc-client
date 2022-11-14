import { atom } from "recoil";

export const allProcurementsFromDBState = atom({
  key: "allProcurementsFromDBState",
  default: [],
});

export const isEditingProcurementState = atom({
  key: "isEditingProcurementState",
  default: false,
});

export const globalProcurementState = atom({
  key: "globalProcurementState",
  default: null,
});
