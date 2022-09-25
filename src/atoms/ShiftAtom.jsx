import { atom } from "recoil";

/**
 * all shifts from the database
 */
export const allShiftsFromDBState = atom({
  key: "allShiftsFromDBState",
  default: [],
});

/**
 * active shift
 */
export const currentlyActiveShiftState = atom({
  key: "currentlyActiveShiftState",
  default: null,
});

/**
 * indicate when editing a shift
 */
export const isEditingShiftState = atom({
  key: "isEditingShiftState",
  default: false,
});
