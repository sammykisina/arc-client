import { atom } from "recoil";

export const allProductsFromDBState = atom({
  key: "allProductsFromDBState",
  default: [],
});

export const globalProductState = atom({
  key: "globalProductState",
  default: null,
});

export const isCreatingProductState = atom({
  key: "isCreatingProductState",
  default: false,
});

export const isEditingProductState = atom({
  key: "isEditingProductState",
  default: false,
});
