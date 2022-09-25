import { atom } from "recoil";

// modal atoms

export const showCreateOrEditProductState = atom({
  key: "showCreateOrEditProductState",
  default: false,
});

export const showDeleteProductModalState = atom({
  key: "showDeleteProductModalState",
  default: false,
});

export const showAddOrEditEmployeeModalState = atom({
  key: "showAddOrEditEmployeeModalState",
  default: false,
});

export const showDeleteEmployeeModalState = atom({
  key: "showDeleteEmployeeModalState",
  default: false,
});

export const showCreateOrEditCategoryModalState = atom({
  key: "showCreateOrEditCategoryModalState",
  default: false,
});

export const showCreateOrEditProductVariantModalState = atom({
  key: "showCreateOrEditProductVariantModalState",
  default: false,
});

export const showDeleteProductVariantModalState = atom({
  key: "showDeleteProductVariantModalState",
  default: false,
});

export const showCreateOrEditShiftState = atom({
  key: "showCreateOrEditShiftState",
  default: false,
});

export const showCreateOrEditOrderModalState = atom({
  key: "showCreateOrEditOrderModalState",
  default: false,
});

export const showCreateOrEditTableModalState = atom({
  key: "showCreateOrEditTableModalState",
  default: false,
});

export const showDeleteTableModalState = atom({
  key: "showDeleteTableModalState",
  default: false,
});
