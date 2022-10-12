import React from "react";
import { useSetRecoilState } from "recoil";
import { globalCategoryState } from "../../atoms/CategoryAtom";
import {
  globalProductVariantState,
  isEditingProductVariantState,
} from "../../atoms/VariantAtom";
import {
  globalProductState,
  isEditingProductState,
} from "../../atoms/ProductAtom";
import { Icon } from "../";
import { globalTableState } from "../../atoms/TableAtom";
import { globalEmployeeState } from "../../atoms/EmployeeAtom";
import { globalSupplierState } from "../../atoms/SuppliersListAtom";

const Modal = ({ modalState, modalStyles, component, close, closeIcon }) => {
  // component states
  const setGlobalCategory = useSetRecoilState(globalCategoryState);
  const setGlobalProduct = useSetRecoilState(globalProductState);
  const setIsEditingProduct = useSetRecoilState(isEditingProductState);
  const setGlobalProductVariant = useSetRecoilState(globalProductVariantState);
  const setIsEditingProductVariant = useSetRecoilState(
    isEditingProductVariantState
  );
  const setGlobalEmployee = useSetRecoilState(globalEmployeeState);
  const setGlobalTable = useSetRecoilState(globalTableState);
  const setGlobalSupplier = useSetRecoilState(globalSupplierState);

  return (
    <section
      className={`${modalState ? "modal-wrapper show " : "modal-wrapper"} `}
    >
      <div className={`modal ${modalStyles} py-5 px-4 flex flex-col gap-y-4`}>
        <Icon
          icon={closeIcon}
          purpose={() => {
            close();
            setGlobalEmployee(null);
            setGlobalCategory(null);
            setGlobalProduct(null);
            setGlobalProductVariant(null);
            setIsEditingProductVariant(null);
            setIsEditingProduct(false);
            setGlobalTable(null);
            setGlobalSupplier(null);
          }}
          iconWrapperStyles="p-1 w-fit h-fit  rounded-full flex justify-center items-center z-50 bg-c_green_light"
        />
        {component}
      </div>
    </section>
  );
};

export default Modal;
