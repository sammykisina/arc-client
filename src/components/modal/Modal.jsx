// react framework imports
import React from "react";

// icon imports {react icons}

// recoil imports {recoil and atoms}
import { useSetRecoilState } from "recoil";
import { globalItemHolderState } from "../../atoms/AppAtoms";
import { globalCategoryState } from "../../atoms/CategoryAtom";
import {
  globalProductVariantState,
  isEditingProductVariantState,
} from "../../atoms/VariantAtom";
import {
  globalProductState,
  isEditingProductState,
} from "../../atoms/ProductAtom";

// api layer imports

// all components imports {local and packages}
import { Icon } from "../";
import { globalTableState } from "../../atoms/TableAtom";

const Modal = ({ modalState, modalStyles, component, close, closeIcon }) => {
  // component states
  const setGlobalItemHolder = useSetRecoilState(globalItemHolderState);
  const setGlobalCategory = useSetRecoilState(globalCategoryState);
  const setGlobalProduct = useSetRecoilState(globalProductState);
  const setIsEditingProduct = useSetRecoilState(isEditingProductState);
  const setGlobalProductVariant = useSetRecoilState(globalProductVariantState);
  const setIsEditingProductVariant = useSetRecoilState(
    isEditingProductVariantState
  );
  const setGlobalTable = useSetRecoilState(globalTableState);

  return (
    <section
      className={`${modalState ? "modal-wrapper show " : "modal-wrapper"} `}
    >
      <div className={`modal ${modalStyles} py-5 px-4 flex flex-col gap-y-4`}>
        <Icon
          icon={closeIcon}
          purpose={() => {
            close();
            setGlobalItemHolder(null);
            setGlobalCategory(null);
            setGlobalProduct(null);
            setGlobalProductVariant(null);
            setIsEditingProductVariant(null);
            setIsEditingProduct(false);
            setGlobalTable(null);
          }}
          iconWrapperStyles="p-1 w-fit h-fit  rounded-full flex justify-center items-center z-50 bg-c_green_light"
        />
        {component}
      </div>
    </section>
  );
};

export default Modal;
