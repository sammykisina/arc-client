import { atom } from "recoil";

export const isEditingTableState = atom({
  key: "isEditingTableState",
  default: false,
});

export const allTablesFromDBState = atom({
  key: "allTablesFromDBState",
  default: [],
});

export const globalTableState = atom({
  key: "globalTableState",
  default: null,
});
