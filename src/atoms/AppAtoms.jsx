import { atom } from "recoil";
import { LocalStorage } from "../utils/localStorage";

// the sidebar atom
export const isSidebarOpenState = atom({
  key: "isSidebarOpenState",
  default: false,
});

// the sidebar atom
export const showSidebarState = atom({
  key: "showSidebarState",
  default: false,
});

// current user auth token
export const currentUserTokenState = atom({
  key: "currentUserAuthTokenState",
  default: LocalStorage.getStoreValue("authenticatedUserToken"),
});

// current user role
export const currentUserRoleState = atom({
  key: "currentUserRoleState",
  default: LocalStorage.getStoreValue("authenticatedUserRole"),
});

// current user work id
export const currentUserWorkIDState = atom({
  key: "currentUserWorkIDState",
  default: LocalStorage.getStoreValue("authenticatedUserWorkID"),
});

// global any item holder
export const globalItemHolderState = atom({
  key: "globalItemHolderState",
  default: null,
});
