import { atom } from "recoil";
import { LocalStorage } from "../utils/localStorage";

export const isSidebarOpenState = atom({
  key: "isSidebarOpenState",
  default: false,
});

export const showSidebarState = atom({
  key: "showSidebarState",
  default: false,
});

export const currentUserTokenState = atom({
  key: "currentUserAuthTokenState",
  default: LocalStorage.getStoreValue("authenticatedUserToken"),
});

export const currentUserRoleState = atom({
  key: "currentUserRoleState",
  default: LocalStorage.getStoreValue("authenticatedUserRole"),
});

export const currentUserWorkIDState = atom({
  key: "currentUserWorkIDState",
  default: LocalStorage.getStoreValue("authenticatedUserWorkID"),
});

export const createProductDecisionTabsIndexState = atom({
  key: "createProductDecisionTabsIndexState",
  default: 0,
});
