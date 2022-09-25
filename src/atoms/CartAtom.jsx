import { atom } from "recoil";
import { LocalStorage } from "../utils/localStorage";

/**
 * hold all cart items
 */
export const cartItemsState = atom({
  key: "cartItemsState",
  default: LocalStorage.getStoreValue("cartItems")
    ? LocalStorage.getStoreValue("cartItems")
    : [],
});
