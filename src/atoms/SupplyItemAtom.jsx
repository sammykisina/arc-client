import { atom } from "recoil";

export const allSupplyItemsFromDBState = atom({
  key: "allSupplyItemsFromDBState",
  default: [],
});

export const globalSupplyItemState = atom({
  key: "globalSupplyItemState",
  default: null,
});

export const isEditingSupplyItemState = atom({
  key: "isEditingSupplyItemState",
  default: false,
});
