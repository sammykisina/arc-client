import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { globalSupplierState } from "../../../atoms/SuppliersListAtom";
import { Title, Line, Button, Select } from "../..";
import { Notification } from "../../../utils/notifications";
import { showAddSupplyItemModalState } from "../../../atoms/ModalAtoms";
import { useSuppliersList } from "../../../hooks";

const AddSupplyItem = () => {
  /**
   * Component states
   */
  const globalSupplier = useRecoilValue(globalSupplierState);
  const { addSupplierSupplyItems } = useSuppliersList();
  const { generateSupplierSupplyItems } = useSuppliersList();
  const [selectedSupplyItems, setSelectedSupplyItems] = useState([]);
  const setShowCreateSupplyItem = useSetRecoilState(
    showAddSupplyItemModalState
  );
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

    addSupplierSupplyItems(selectedSupplyItems);

    setShowCreateSupplyItem(false);
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
    <section className="relative h-full">
      <Title title={`Supply Items for ${globalSupplier?.attributes?.name}.`} />
      <Line lineStyles="bg-c_yellow/100 w-[25px] h-[5px] rounded-full" />

      <Select
        title=""
        options={generateSupplierSupplyItems()}
        selectWrapperStyles="w-full rounded-md ring-c_gray mt-5  py-2 px-2"
        selectPanelStyles="ring-c_gray/40 shadow h-[90px]"
        selected={selectedSupplyItems}
        multiple
        setSelected={(option) => setSelectedSupplyItems(option)}
        selectLabel="Select Supply items Options"
        selectLabelStyles="border text-base text-c_dark/50 rounded-full px-1"
      />

      <div className="flex justify-end items-center mt-2 absolute bottom-0 w-full">
        <Button
          title="Save"
          buttonStyles="flex items-center gap-x-2 px-4 py-2 bg-c_yellow rounded-xl text-white text-sm"
          purpose={handleSubmit}
        />
      </div>
    </section>
  );
};

export default AddSupplyItem;
