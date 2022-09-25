import { atom } from "recoil";
import { LocalStorage } from "../utils/localStorage";

/**
 * hold the counter tabs index
 */
export const counterTabsIndexState = atom({
  key: "counterTabsIndexState",
  default: LocalStorage.getStoreValue("counterTabsCurrentIndex")
    ? LocalStorage.getStoreValue("counterTabsCurrentIndex")
    : 0,
});
