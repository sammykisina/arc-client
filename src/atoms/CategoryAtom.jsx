import { atom } from "recoil";

/**
 * hold all the categories from the database
 */
export const allCategoriesFromDBState = atom({
  key: "allCategoriesFromDBState",
  default: [],
});

/**
 * hold a global single category
 */
export const globalCategoryState = atom({
  key: "globalCategoryState",
  default: null,
});

/**
 * indicate when creating a new category
 */
export const isCreatingCategoryState = atom({
  key: "isCreatingCategoryState",
  default: false,
});

/**
 * indicate when editing a created category
 */
export const isEditingCategoryState = atom({
  key: "isEditingCategoryState",
  default: false,
});

/**
 * show delete category modal
 */
export const showDeleteCategoryModalState = atom({
  key: "showDeleteCategoryModalState",
  default: false,
});
