// react framework imports
import React from "react";

// icon imports {react icons}
import { MdCancel, MdDelete } from "react-icons/md";

// recoil imports {recoil and atoms}
import { useRecoilState, useSetRecoilState } from "recoil";
import { globalProductVariantState } from "../../../atoms/VariantAtom";
import { showDeleteProductVariantModalState } from "../../../atoms/ModalAtoms";
import {
  allProductsFromDBState,
  globalProductState,
} from "../../../atoms/ProductAtom";

// api layer imports
import { ProductVariantAPI } from "../../../api/productVariantAPI";

// all components imports {local and packages}
import { Button, Title } from "../../";
import { Notification } from "../../../utils/notifications";

const DeleteProductVariant = () => {
  // component states
  const [globalProductVariant, setGlobalProductVariant] = useRecoilState(
    globalProductVariantState
  );
  const [globalProduct, setGlobalProduct] = useRecoilState(globalProductState);
  const setShowDeleteProductVariantModal = useSetRecoilState(
    showDeleteProductVariantModalState
  );
  const [allProductsFromDB, setAllProductsFromDB] = useRecoilState(
    allProductsFromDBState
  );

  // component functions

  /**
   * delete the product variant
   */
  const deleteProductVariant = () => {
    ProductVariantAPI.delete(globalProductVariant?.attributes?.uuid).then(
      (response) => {
        if (response.error === 0) {
          // filter the deleted variant from all variants
          const newVariants = globalProduct?.relationships?.variants.filter(
            (variant) =>
              variant?.attributes?.uuid !==
              globalProductVariant?.attributes?.uuid
          );

          // set the new variants to the product and the set all as the new products
          setAllProductsFromDB(
            allProductsFromDB.map((productFromDB) =>
              productFromDB?.attributes?.uuid ===
              globalProduct?.attributes?.uuid
                ? {
                    ...globalProduct,
                    relationships: {
                      ...globalProduct?.relationships,
                      variants: newVariants,
                    },
                  }
                : productFromDB
            )
          );
        }

        // notifications
        response.error === 1
          ? Notification.errorNotification(response.message)
          : Notification.successNotification(response?.message);

        // reset the states
        setGlobalProduct(null);
        setGlobalProductVariant(null);
        setShowDeleteProductVariantModal(false);
      }
    );
  };

  return (
    <section>
      {/* title */}
      <Title title="Delete Product Variant." />

      {/* confirmation method */}
      <div className="flex justify-center mt-4 text-c_dark">
        <p className="border border-c_gray/20 w-[70%] px-3 py-1 rounded-md flex flex-col gap-y-3">
          {`Are you sure you want to delete the  Variant  ${globalProductVariant?.attributes?.name}`}

          <span className="font-semibold text-red-500 text-sm">
            Be aware! This action is not reversible.
          </span>
        </p>
      </div>

      {/* the decision control buttons */}
      <div className="mt-10 flex justify-end gap-x-4">
        <Button
          title="Delete"
          icon={<MdDelete className="w-5 h-5 text-white" />}
          buttonStyles="flex items-center gap-x-2 px-4 py-2 bg-red-500 rounded-xl text-white disabled:bg-c_yellow/10"
          purpose={deleteProductVariant}
        />

        <Button
          title="Cancel"
          icon={<MdCancel className="w-5 h-5 text-white" />}
          buttonStyles="flex items-center gap-x-2 px-4 py-2 bg-c_yellow rounded-xl text-white disabled:bg-c_yellow/10"
          purpose={() => {
            setGlobalProductVariant(null);
            setShowDeleteProductVariantModal(false);
          }}
        />
      </div>
    </section>
  );
};

export default DeleteProductVariant;
