import { atom } from "recoil";

export const allCategoriesFromDBState = atom({
  key: "allCategoriesFromDBState",
  default: [],
});

export const globalCategoryState = atom({
  key: "globalCategoryState",
  default: null,
});

export const isEditingCategoryState = atom({
  key: "isEditingCategoryState",
  default: false,
});

