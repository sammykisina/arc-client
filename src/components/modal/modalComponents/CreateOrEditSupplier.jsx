import { useEffect, useState } from "react";
import useSuppliersList from "../../../hooks/useSuppliersList";
import { Button, Line, Select, Title } from "../../";
import { useForm } from "react-hook-form";
import { BsSave } from "react-icons/bs";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  globalSupplierState,
  isEditingSupplierState,
} from "../../../atoms/SuppliersListAtom";
import { Notification } from "../../../utils/notifications";
import { showCreateOrEditSupplierModalState } from "../../../atoms/ModalAtoms";

const CreateOrEditSupplier = () => {
  /**
   * Component states
   */
  const {
    supplierInputs,
    createSupplier,
    getCurrentlyAssignedSupplierNames,
    getSupplierEditData,
    updateSupplier,
  } = useSuppliersList();
  const [selectedStatus, setSelectedStatus] = useState("");
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
      Notification.errorNotification("Current Supplier Status is required");
      return;
    }

    // validate if the entered name has been taken
    if (
      !isEditingSupplier &&
      getCurrentlyAssignedSupplierNames().includes(name)
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
    <section className="relative h-[320px] sm:h-[200px]">
      <div className="pb-2">
        <Title
          title={isEditingSupplier ? "Edit Supplier." : "Create  Supplier."}
        />
        <Line lineStyles="bg-c_yellow/100 w-[25px] h-[5px] rounded-full" />
      </div>

      <form
        className="h-[400px] sm:h-[270px]  overflow-auto sm:items-center pt-5 pb-10 px-1 flex flex-col gap-5 sm:grid grid-cols-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        {supplierInputs.map((supplierInput, supplierInputIndex) => (
          <div key={supplierInputIndex}>
            {supplierInput.component === "Input" ? (
              <div className={`input-group`}>
                <input
                  type={supplierInput.type}
                  placeholder=""
                  {...register(supplierInput.name, {
                    required: supplierInput.required,
                  })}
                  className="input mt-1"
                />

                <label className="placeholder border">
                  {supplierInput.label}
                </label>

                {errors[supplierInput.name] && (
                  <span className="error">{supplierInput.errorMessage}</span>
                )}
              </div>
            ) : (
              <Select
                title=""
                options={supplierInput.options}
                selectWrapperStyles="w-full rounded-md ring-c_gray  py-2 px-2"
                selectPanelStyles="ring-c_gray/40 shadow h-[90px]"
                selected={selectedStatus}
                setSelected={(option) => setSelectedStatus(option)}
                selectLabel={supplierInput.label}
                selectLabelStyles="border text-base text-c_dark/50 rounded-full px-1"
              />
            )}
          </div>
        ))}

        <div className="absolute -bottom-[100px]  right-0">
          <Button
            title="Save"
            icon={<BsSave className="w-5 h-5 text-white" />}
            buttonStyles="flex items-center gap-x-2 px-4 py-2 bg-c_yellow rounded-xl text-white"
            buttonTitleWrapperStyles="hidden sm:block"
            type="submit"
          />
        </div>
      </form>
    </section>
  );
};

export default CreateOrEditSupplier;
