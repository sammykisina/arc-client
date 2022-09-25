import { atom } from "recoil";

/**
 * all counters from the database
 */
export const allCounterShelvesFromDBState = atom({
  key: "allCounterShelvesFromDBState",
  default: [],
});

/**
 * hold state when fetching counter shelves
 */
export const isFetchingCounterShelvesState = atom({
  key: "isFetchingCounterShelvesState",
  default: false,
});
