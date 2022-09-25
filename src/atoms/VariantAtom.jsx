import { atom } from "recoil";

/**
 * all product variants from the database
 */
export const allProductVariantsFromDBState = atom({
  key: "allProductVariantsFromDBState",
  default: [],
});

/**
 * hold isEditingProductVariant state
 */
export const isEditingProductVariantState = atom({
  key: "isEditingProductVariantState",
  default: false,
});

/**
 * hold a global product variant
 */
export const globalProductVariantState = atom({
  key: "globalProductVariantState",
  default: null,
});
