import { atom } from "recoil";

export const allSuppliersFromDBState = atom({
  key: "allSuppliersFromDBState",
  default: [],
});

export const isEditingSupplierState = atom({
  key: "isEditingSupplierState",
  default: false,
});

export const globalSupplierState = atom({
  key: "globalSupplierState",
  default: null,
});
