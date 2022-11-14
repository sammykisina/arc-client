import { useEffect } from "react";
import useSuppliersList from "../../../hooks/useSupplier";
import { Button, Line, ModalClose, ModalHeader, Select, Title } from "../../";
import { useForm } from "react-hook-form";
import { BsSave } from "react-icons/bs";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  globalSupplierState,
  isEditingSupplierState,
} from "../../../atoms/SupplierAtom";
import { Notification } from "../../../utils/notifications";
import { showCreateOrEditSupplierModalState } from "../../../atoms/ModalAtom";
import { checkIfExitsInArray } from "../../../utils/app";

const CreateOrEditSupplier = () => {
  /**
   * Component states
   */
  const {
    supplierInputs,
    createSupplier,
    getCurrentlyCreatedSuppliers,
    getSupplierEditData,
    updateSupplier,
    selectedStatus,
    setSelectedStatus,
    selectedSupplierSupplyItems,
  } = useSuppliersList();
  const [isEditingSupplier, setIsEditingSupplier] = useRecoilState(
    isEditingSupplierState
  );
  const setShowCreateOrEditSupplierModal = useSetRecoilState(
    showCreateOrEditSupplierModalState
  );
  const [globalSupplier, setGlobalSupplier] =
    useRecoilState(globalSupplierState);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  /**
   * Component functions
   */
  const onSubmit = ({ name, location, phone_number, email }) => {
    // validation
    if (selectedStatus === "") {
      Notification.errorNotification("Current Supplier Status is required.");
      return;
    }

    if (!isEditingSupplier && selectedSupplierSupplyItems.length === 0) {
      Notification.errorNotification(
        "Choose the Items Supplied By This Supplier."
      );
      return;
    }

    // validate if the entered name has been taken
    if (
      !isEditingSupplier &&
      checkIfExitsInArray(getCurrentlyCreatedSuppliers(), name)
    ) {
      Notification.errorNotification("The suppler name has been taken.");
      return;
    }

    // when editing
    let supplierEditData = {};
    if (isEditingSupplier) {
      supplierEditData = getSupplierEditData({
        name,
        location,
        phone_number,
        email,
        selectedStatus,
      });

      if (Object.keys(supplierEditData).length === 0) {
        setGlobalSupplier(null),
          setIsEditingSupplier(false),
          Notification.errorNotification("Nothing to edit."),
          setShowCreateOrEditSupplierModal(false);

        return;
      }
    }

    // actual creating or editing of the supplier
    isEditingSupplier
      ? updateSupplier(supplierEditData, {
          name,
          location,
          phone_number,
          email,
          selectedStatus,
        })
      : createSupplier({
          name,
          location,
          phone_number,
          email,
          status: selectedStatus?.value,
          items: selectedSupplierSupplyItems,
        });

    setShowCreateOrEditSupplierModal(false);
  };

  // set the from with initial values when editing
  useEffect(() => {
    if (globalSupplier) {
      reset({
        name: globalSupplier?.attributes?.name,
        location: globalSupplier?.attributes?.contact_info?.location,
        phone_number: globalSupplier?.attributes?.contact_info?.phone_number,
        email: globalSupplier?.attributes?.contact_info?.email,
      });

      setSelectedStatus({
        name: globalSupplier?.attributes?.status,
        value: globalSupplier?.attributes?.status,
      });
    }
  }, [globalSupplier]);

  return (
    <section className="space-y-5">
      {/* Header */}
      <ModalHeader
        close={() => {
          setGlobalSupplier(null),
            setIsEditingSupplier(false),
            setShowCreateOrEditSupplierModal(false);
        }}
        isEditing={isEditingSupplier}
        editTitle="Editing Supplier"
        createTitle="Creating A Supplier"
      />

      {/* Body */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="duration-300 space-y-2 sm:space-y-0 relative sm:grid grid-cols-5 gap-x-2 px-4"
      >
        {/* info section */}
        <section className="space-y-4 col-span-3">
          <Title title="General Info" />

          <div className="space-y-3">
            {supplierInputs[0].map((supplierInput, supplierInputIndex) => (
              <div className={`input-group`} key={supplierInputIndex}>
                <input
                  type={supplierInput.type}
                  placeholder=""
                  {...register(supplierInput.name, {
                    required: supplierInput.required,
                  })}
                  className="input"
                />

                <label className="placeholder border">
                  {supplierInput.label}
                </label>

                {errors[supplierInput.name] && (
                  <span className="error">{supplierInput.errorMessage}</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Supply Items And Status Section */}
        <section className="space-y-5 col-span-2 py-2 sm:py-0 sm:px-2 border-t sm:border-t-0 border-l border-c_yellow">
          <Title
            title={`${isEditingSupplier ? "Status" : "Supply Item and Status"}`}
          />

          <div className="space-y-5">
            {supplierInputs[1].map((supplierInput, supplierInputIndex) => (
              <Select
                key={supplierInputIndex}
                title=""
                options={supplierInput.options}
                selectWrapperStyles={`w-full rounded-md ring-c_gray  py-2 px-2 ${
                  isEditingSupplier && supplierInput.extraStyles
                }`}
                selectPanelStyles="ring-c_gray/40 shadow h-[90px]"
                selected={supplierInput.selected}
                setSelected={(option) => supplierInput.setSelected(option)}
                selectLabel={supplierInput.label}
                selectLabelStyles="border text-base text-c_dark/50 rounded-full px-1"
                multiple={supplierInput.multiple}
              />
            ))}
          </div>
        </section>

        {/* submit button */}
        <div className="absolute -top-[20px] sm:top-[230px] flex justify-end w-full px-8">
          <Button
            title="Save"
            icon={<BsSave className="w-5 h-5" />}
            buttonStyles=" flex items-center gap-x-2 px-4 py-2 bg-c_yellow rounded-xl text-white hover:text-c_dark"
            type="submit"
          />
        </div>
      </form>
    </section>
  );
};

export default CreateOrEditSupplier;
