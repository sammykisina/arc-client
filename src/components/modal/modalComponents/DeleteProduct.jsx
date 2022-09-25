// react framework imports
import React from "react";

// icon imports {react icons}
import { MdCancel, MdDelete } from "react-icons/md";

// recoil imports {recoil and atoms}
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  allProductsFromDBState,
  globalProductState,
} from "../../../atoms/ProductAtom";
import { showDeleteProductModalState } from "../../../atoms/ModalAtoms";

// api layer imports
import { ProductAPI } from "../../../api/productAPI";

// all components imports {local and packages}
import { Button, Title } from "../../";
import { Notification } from "../../../utils/notifications";

const DeleteProduct = () => {
  // components states
  const [globalProduct, setGlobalProduct] = useRecoilState(globalProductState);
  const setShowDeleteProductModal = useSetRecoilState(
    showDeleteProductModalState
  );
  const [allProductsFromDB, setAllProductsFromDB] = useRecoilState(
    allProductsFromDBState
  );

  // component functions

  /**
   * delete the product
   */
  const deleteProduct = () => {
    ProductAPI.delete(globalProduct?.attributes?.uuid).then((response) => {
      if (response.error === 0) {
        // filter the current products to remove the deleted one
        const newProducts = allProductsFromDB.filter(
          (productFromDB) =>
            productFromDB?.attributes?.uuid !== globalProduct?.attributes?.uuid
        );
        // set the new filtered products
        setAllProductsFromDB(newProducts);
      }

      // notifications
      response.error === 1
        ? Notification.errorNotification(response.message)
        : Notification.successNotification(response?.message);

      // reset the states
      setGlobalProduct(null);
      setShowDeleteProductModal(false);
    });
  };

  return (
    <section>
      {/* title */}
      <Title title="Delete Product." />

      {/* confirmation method */}
      <div className="flex justify-center mt-4 text-c_dark">
        <p className="border border-c_gray/20 w-[70%] px-3 py-1 rounded-md flex flex-col gap-y-3">
          {`Are you sure you want to delete the product ${globalProduct?.attributes?.name}`}

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
          purpose={deleteProduct}
        />

        <Button
          title="Cancel"
          icon={<MdCancel className="w-5 h-5 text-white" />}
          buttonStyles="flex items-center gap-x-2 px-4 py-2 bg-c_yellow rounded-xl text-white disabled:bg-c_yellow/10"
          purpose={() => {
            setGlobalProduct(null);
            setShowDeleteProductModal(false);
          }}
        />
      </div>
    </section>
  );
};

export default DeleteProduct;
