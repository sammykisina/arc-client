import { atom } from "recoil";

export const allOrdersFromDBState = atom({
  key: "allOrdersFromDBState",
  default: [],
});

export const globalOrderObjectState = atom({
  key: "globalOrderObjectState",
  default: null,
});
