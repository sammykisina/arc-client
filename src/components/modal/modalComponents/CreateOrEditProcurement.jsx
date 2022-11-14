import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsSave } from "react-icons/bs";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Title, Select, Button, ModalHeader } from "../../";
import { showCreateOrEditProcurementModalState } from "../../../atoms/ModalAtom";
import {
  globalProcurementState,
  isEditingProcurementState,
} from "../../../atoms/ProcurementAtom";
import { useProcurement, useSupplier } from "../../../hooks";
import { Notification } from "../../../utils/notifications";

const CreateOrEditProcurement = () => {
  /**
   * Component states
   */
  const [isEditingProcurement, setIsEditingProcurement] = useRecoilState(
    isEditingProcurementState
  );
  const { createProcurement, updateProcurement } = useProcurement();
  const { getCurrentlyCreatedSuppliers } = useSupplier();
  const [supplierSupplierItemsOptions, setSupplierSupplierItemsOptions] =
    useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedSupplyItem, setSelectedSupplyItem] = useState("");
  const [selectedFrom, setSelectedFrom] = useState("");
  const setShowCreateOrEditProcurementModal = useSetRecoilState(
    showCreateOrEditProcurementModalState
  );
  const [globalProcurement, setGlobalProcurement] = useRecoilState(
    globalProcurementState
  );
  const [selectedStatus, setSelectedStatus] = useState("");
  const { register, handleSubmit, reset } = useForm();

  /**
   * Component function
   */
  const onSubmit = ({
    form_quantity,
    number_of_single_pieces,
    total_amount,
    number_of_pieces_in_form,
  }) => {
    // validation
    /**
     * Creating validation
     */
    if (!isEditingProcurement) {
      if (!isEditingProcurement && selectedSupplier === "") {
        Notification.errorNotification("Select The Supplier.");
        return;
      }

      if (selectedSupplyItem === "") {
        Notification.errorNotification("Select The Procurement Item.");
        return;
      }

      if (selectedFrom === "") {
        Notification.errorNotification("Select The Procurement Item Form.");
        return;
      }

      if (
        (form_quantity === "0" || form_quantity === "") &&
        selectedFrom != "singles"
      ) {
        Notification.errorNotification(
          "The Procurement Item Form Quantity is Required."
        );
        return;
      }

      if (
        (number_of_single_pieces === "0" || number_of_single_pieces === "") &&
        selectedFrom === "singles"
      ) {
        Notification.errorNotification("Number Of Single Pieces is Required.");
        return;
      }
    }

    /**
     * Editing validation
     */
    if (isEditingProcurement) {
      if (selectedStatus === "" || selectedStatus === "pending") {
        Notification.errorNotification("The Procurement Status is Required.");
        return;
      }

      if (selectedStatus.value != "cancelled" && total_amount === "") {
        Notification.errorNotification(
          "The Procurement Total Cost Is Required."
        );
        return;
      }

      if (
        selectedStatus.value != "cancelled" &&
        globalProcurement?.relationships?.item?.attributes?.form != "singles" &&
        number_of_pieces_in_form === ""
      ) {
        Notification.errorNotification(
          "The Number of Items In Each Form Is Required."
        );
        return;
      }
    }

    isEditingProcurement
      ? updateProcurement(
          selectedStatus.value === "cancelled"
            ? { status: selectedStatus?.value }
            : globalProcurement?.relationships?.item?.attributes?.form ===
              "singles"
            ? {
                total_amount,
                status: selectedStatus.value,
                delivered_date: new Date().toLocaleString(),
              }
            : {
                total_amount,
                number_of_pieces_in_form,
                status: selectedStatus.value,
                delivered_date: new Date().toLocaleString(),
              }
        )
      : createProcurement(
          selectedFrom === "singles"
            ? {
                supplier_id: selectedSupplier?.value,
                item: {
                  type: selectedSupplyItem?.type,
                  value: selectedSupplyItem?.value,
                  form: selectedFrom,
                  number_of_single_pieces: number_of_single_pieces,
                  measure: selectedSupplyItem?.measure,
                },
              }
            : {
                supplier_id: selectedSupplier?.value,
                item: {
                  type: selectedSupplyItem?.type,
                  value: selectedSupplyItem?.value,
                  form: selectedFrom,
                  form_quantity: form_quantity,
                  measure: selectedSupplyItem?.measure,
                },
              }
        );

    setShowCreateOrEditProcurementModal(false);
  };

  // set the form inputs to default data when editing
  useEffect(() => {
    if (globalProcurement) {
      reset({
        form:
          globalProcurement?.relationships?.item?.attributes?.form != "singles"
            ? globalProcurement?.relationships?.item?.attributes
                ?.form_quantity +
              "-" +
              globalProcurement?.relationships?.item?.attributes?.form +
              "(s)"
            : globalProcurement?.relationships?.item?.attributes
                ?.number_of_single_pieces +
              "-" +
              (globalProcurement?.relationships?.item?.attributes
                ?.number_of_single_pieces > 1
                ? "Singles"
                : "single"),
      });

      setSelectedStatus(globalProcurement?.attributes?.status);
    }
  }, [globalProcurement]);

  useEffect(() => {
    if (selectedSupplier) {
      setSupplierSupplierItemsOptions(selectedSupplier?.items);
    }

    if (selectedSupplyItem != "") {
      setSelectedSupplyItem("");
    }
  }, [selectedSupplier]);

  return (
    <section className="space-y-4 h-fit">
      {/* Header */}
      <ModalHeader
        close={() => {
          setGlobalProcurement(null),
            setIsEditingProcurement(false),
            setShowCreateOrEditProcurementModal(false);
        }}
        isEditing={isEditingProcurement}
        editTitle={`Editing Procurement No: ${globalProcurement?.attributes?.number}
              Item Name: ${globalProcurement?.relationships?.item?.attributes?.name}`}
        createTitle="Creating A Procurement"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        <div className="space-y-5 sm:space-y-0 sm:grid grid-cols-5 gap-x-2 px-4 divide-y sm:divide-x sm:divide-y-0 divide-c_yellow ">
          {/* Procurement General Info Section */}
          <section className="space-y-4 col-span-2">
            <Title title="General Info" />

            {isEditingProcurement ? (
              <div className="col-span-2 flex flex-col gap-y-5 h-fit">
                <Select
                  title=""
                  options={[
                    { name: "Delivered", value: "delivered" },
                    { name: "Cancel", value: "cancelled" },
                  ]}
                  selectWrapperStyles={`w-full rounded-md ring-c_gray  py-2 px-2 `}
                  selectPanelStyles="ring-c_gray/40 shadow h-[90px]"
                  selected={selectedStatus}
                  setSelected={(option) => setSelectedStatus(option)}
                  selectLabel="Select Status"
                  selectLabelStyles="border text-c_dark/50 rounded-full px-1"
                />

                <div className={`input-group`}>
                  <input
                    type="text"
                    placeholder=""
                    {...register("form")}
                    className="input"
                    readOnly
                  />

                  <label className="placeholder border">Item Form</label>
                </div>
              </div>
            ) : (
              <Select
                title=""
                options={getCurrentlyCreatedSuppliers()}
                selectWrapperStyles={`w-full rounded-md ring-c_gray  py-2 px-2 col-span-2`}
                selectPanelStyles="ring-c_gray/40 shadow h-[90px]"
                selected={selectedSupplier}
                setSelected={(option) => setSelectedSupplier(option)}
                selectLabel="Select The Supplier."
                selectLabelStyles="border text-c_dark/50 rounded-full px-1"
              />
            )}
          </section>

          {/* Procurement Item Info section */}
          <section className="col-span-3 space-y-4 pt-2 sm:pl-2">
            <Title title="Procurement Item Info" />

            {isEditingProcurement ? (
              <div className="flex flex-col h-fit  justify-center gap-y-4">
                <div
                  className={`input-group ${
                    selectedStatus.value === "cancelled" ? "hidden" : "block"
                  }`}
                >
                  <input
                    type="number"
                    placeholder=""
                    {...register("total_amount")}
                    className="input"
                  />

                  <label className="placeholder border">
                    Procurement Total Cost
                  </label>
                </div>

                {globalProcurement?.relationships?.item?.attributes?.form !=
                  "singles" && (
                  <div
                    className={`input-group ${
                      selectedStatus.value === "cancelled" ? "hidden" : "block"
                    }`}
                  >
                    <input
                      type="number"
                      placeholder=""
                      {...register("number_of_pieces_in_form")}
                      className="input"
                    />

                    <label className="placeholder border">
                      Number Of Pieces In Each From
                    </label>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-y-5">
                <Select
                  title=""
                  options={supplierSupplierItemsOptions}
                  selectWrapperStyles={`w-full rounded-md ring-c_gray  py-2 px-2`}
                  selectPanelStyles="ring-c_gray/40 shadow h-[90px]"
                  selected={selectedSupplyItem}
                  setSelected={(option) => setSelectedSupplyItem(option)}
                  selectLabel="Select The Procurement Item."
                  selectLabelStyles="border  text-c_dark/50 rounded-full px-1"
                />

                <Select
                  title=""
                  options={["box", "crate", "singles", "pack"]}
                  selectWrapperStyles={`w-full rounded-md ring-c_gray  py-2 px-2`}
                  selectPanelStyles="ring-c_gray/40 shadow h-[90px]"
                  selected={selectedFrom}
                  setSelected={(option) => setSelectedFrom(option)}
                  selectLabel="Select The Item Form."
                  selectLabelStyles="border text-c_dark/50 rounded-full px-1"
                />

                <div
                  className={`input-group ${
                    selectedFrom === "singles" ? "hidden" : "block"
                  }`}
                >
                  <input
                    type="number"
                    placeholder=""
                    {...register("form_quantity")}
                    className="input"
                  />

                  <label className="placeholder border">
                    Enter the From Quantity
                  </label>
                </div>

                <div
                  className={`input-group ${
                    selectedFrom === "singles" ? "block" : "hidden"
                  }`}
                >
                  <input
                    type="number"
                    placeholder=""
                    {...register("number_of_single_pieces")}
                    className="input"
                  />

                  <label className="placeholder border">
                    Enter Number Of Single Pieces
                  </label>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Submit Btn */}
        <div
          className={`absolute  px-4 duration-300 w-fit ${
            isEditingProcurement
              ? "-top-[15px] right-0"
              : "-top-[15px] right-0 sm:left-0 sm:top-[160px]"
          }`}
        >
          <Button
            title="Save"
            icon={<BsSave className="w-5 h-5" />}
            buttonStyles="primary_button"
            type="submit"
          />
        </div>
      </form>
    </section>
  );
};

export default CreateOrEditProcurement;
