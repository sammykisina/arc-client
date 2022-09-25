import { atom } from "recoil";

/**
 * all products from the database
 */
export const allProductsFromDBState = atom({
  key: "allProductsFromDBState",
  default: [],
});

/**
 * hold a global product
 */
export const globalProductState = atom({
  key: "globalProductState",
  default: null,
});

/**
 * indicate when creating a new product
 */
export const isCreatingProductState = atom({
  key: "isCreatingProductState",
  default: false,
});

/**
 * indicate when editing a product
 */
export const isEditingProductState = atom({
  key: "isEditingProductState",
  default: false,
});
