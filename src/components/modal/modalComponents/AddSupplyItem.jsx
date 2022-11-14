import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { globalSupplierState } from "../../../atoms/SupplierAtom";
import { Title, Line, Button, Select, ModalClose, ModalHeader } from "../..";
import { Notification } from "../../../utils/notifications";
import { showAddSupplyItemModalState } from "../../../atoms/ModalAtom";
import { useSupplier } from "../../../hooks";
import { BsSave } from "react-icons/bs";

const AddSupplyItem = () => {
  /**
   * Component states
   */
  const [globalSupplier, setGlobalSupplier] =
    useRecoilState(globalSupplierState);
  const { addSupplierSupplyItems, generateSupplyItems } = useSupplier();
  const [selectedSupplyItems, setSelectedSupplyItems] = useState([]);
  const setShowAddSupplyItem = useSetRecoilState(showAddSupplyItemModalState);
  /**
   * Component functions
   */

  const handleSubmit = () => {
    // validation
    if (selectedSupplyItems.length === 0) {
      Notification.errorNotification(
        "Select the Supply Items Supplied by The Supplier."
      );

      return;
    }

    addSupplierSupplyItems(selectedSupplyItems), setShowAddSupplyItem(false);
  };

  useEffect(() => {
    const supplierPrevSupplyProducts = globalSupplier?.relationships?.products;
    const supplierPrevSupplyVariants = globalSupplier?.relationships?.variants;
    const prevSelectedSupplierSupplyItems = new Set();

    /**
     * Loop to create a new Set of previous selected supply items
     */
    supplierPrevSupplyProducts?.forEach((supplierPrevSupplyProduct) => {
      prevSelectedSupplierSupplyItems.add({
        name: supplierPrevSupplyProduct?.attributes?.name,
        value: supplierPrevSupplyProduct?.id,
        form: "Product",
      });
    });

    supplierPrevSupplyVariants?.forEach((supplierPrevSupplyVariant) => {
      prevSelectedSupplierSupplyItems.add({
        name:
          supplierPrevSupplyVariant?.relationships?.product?.attributes?.name +
          "_" +
          supplierPrevSupplyVariant?.attributes?.name +
          "_" +
          supplierPrevSupplyVariant?.attributes?.measure +
          "ml",
        value: supplierPrevSupplyVariant?.id,
        form: "Variant",
      });
    });

    setSelectedSupplyItems([...prevSelectedSupplierSupplyItems.values()]);
  }, [globalSupplier]);

  return (
    <section className="space-y-5 ">
      {/* Header */}
      <ModalHeader
        close={() => {
          setGlobalSupplier(null), setShowAddSupplyItem(false);
        }}
        title={`Supply Items for : ${globalSupplier?.attributes?.name}`}
      />

      {/* Body */}
      <section className="h-[130px] flex  flex-col justify-between  px-4">
        <Select
          title=""
          options={generateSupplyItems()}
          selectWrapperStyles="w-4/5 rounded-md ring-c_gray py-2 px-2"
          selectPanelStyles="ring-c_gray/40 shadow h-[90px]"
          selected={selectedSupplyItems}
          multiple
          setSelected={(option) => setSelectedSupplyItems(option)}
          selectLabel="Select Supply items"
          selectLabelStyles="border text-base text-c_dark/50 rounded-full px-1"
        />

        {/* Submit Btn */}
        <div className="flex justify-end">
          <Button
            title="Save"
            icon={<BsSave className="w-5 h-5" />}
            buttonStyles="primary_button"
            buttonTitleWrapperStyles="hidden sm:block"
            purpose={handleSubmit}
          />
        </div>
      </section>
    </section>
  );
};

export default AddSupplyItem;
