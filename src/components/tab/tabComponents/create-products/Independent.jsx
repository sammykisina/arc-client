import React, { useState } from "react";
import { useProduct } from "../../../../hooks";
import { Button, CheckBox, Select } from "../../..";
import { useForm } from "react-hook-form";
import { BsSave } from "react-icons/bs";
import { Notification } from "../../../../utils/notifications";
import { showCreateOrEditProductState } from "../../../../atoms/ModalAtoms";
import {
  globalProductState,
  isEditingProductState,
} from "../../../../atoms/ProductAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useEffect } from "react";

const Independent = () => {
  /**
   * Component states
   */
  const {
    independentProductInputs,
    createProduct,
    updateProduct,
    generateCurrentlyAssignedProductNames,
    getIndependentProductEditData,
  } = useProduct();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [allowVAT, setAllowVAT] = useState(true);
  const setShowCreateOrEditProduct = useSetRecoilState(
    showCreateOrEditProductState
  );
  const [globalProduct, setGlobalProduct] = useRecoilState(globalProductState);
  const [isEditingProduct, setIsEditingProduct] = useRecoilState(
    isEditingProductState
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  /**
   * Component functions
   */
  const onSubmit = ({
    name,
    cost,
    retail,
    initial_number_of_pieces,
    measure,
  }) => {
    // validation
    if (selectedCategory === "")
      return Notification.errorNotification("Product category is required.");

    // validating if the given product name has been given to another product
    if (
      !isEditingProduct &&
      generateCurrentlyAssignedProductNames().includes(name)
    ) {
      Notification.errorNotification("The product name has been taken.");

      return;
    }

    // when editing
    let productEditData = {};
    if (isEditingProduct) {
      productEditData = getIndependentProductEditData({
        name,
        cost,
        retail,
        initial_number_of_pieces,
        measure,
        selectedCategory,
        allowVAT,
      });

      if (Object.keys(productEditData).length === 0) {
        setGlobalProduct(null),
          setIsEditingProduct(false),
          Notification.errorNotification("Nothing to edit."),
          setShowCreateOrEditProduct(false);

        return;
      }
    }

    // actual creating or editing of products
    isEditingProduct
      ? updateProduct(productEditData, {
          name,
          cost,
          retail,
          initial_number_of_pieces,
          measure,
          selectedCategory,
          allowVAT,
        })
      : createProduct({
          name,
          cost: parseInt(cost),
          retail: parseInt(retail),
          initial_number_of_pieces: parseInt(initial_number_of_pieces),
          measure: parseInt(measure),
          category_id: selectedCategory?.value,
          vat: allowVAT,
          form: "independent",
        });

    setShowCreateOrEditProduct(false);
  };

  /**
   * set the default values when editing
   */
  useEffect(() => {
    if (globalProduct) {
      reset({
        name: globalProduct?.attributes?.name,
        cost: globalProduct?.attributes?.price?.cost.toString(),
        retail: globalProduct?.attributes?.price?.retail.toString(),
        measure: globalProduct?.attributes?.measure.toString(),
        // will only be equal only when the product is created
        initial_number_of_pieces:
          globalProduct?.attributes?.inventory?.store ===
            globalProduct?.attributes?.inventory?.stock &&
          globalProduct?.attributes?.inventory?.store,
      });

      setSelectedCategory({
        name: globalProduct?.relationships?.category?.attributes?.name,
        value: globalProduct?.relationships?.category?.id,
      });

      setAllowVAT(globalProduct?.attributes?.vat);
    }
  }, [globalProduct]);

  return (
    <div className="relative h-[320px] sm:h-[200px]">
      <form
        className="h-[270px] sm:h-[200px]  overflow-auto sm:items-center  pt-3 pb-6 px-1 flex flex-col gap-5 sm:grid grid-cols-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        {independentProductInputs.map(
          (independentProductInput, independentProductInputIndex) => (
            <div key={independentProductInputIndex}>
              {independentProductInput.component === "Input" ? (
                <div className={`input-group`}>
                  <input
                    type={independentProductInput.type}
                    placeholder=""
                    {...register(independentProductInput.name, {
                      required: independentProductInput.required,
                    })}
                    readOnly={independentProductInput.readonly}
                    className="input mt-1"
                  />

                  <label className="placeholder border">
                    {independentProductInput.label}
                  </label>

                  {errors[independentProductInput.name] && (
                    <span className="error">
                      {independentProductInput.errorMessage}
                    </span>
                  )}
                </div>
              ) : independentProductInput.component === "Select" ? (
                <Select
                  title=""
                  options={independentProductInput.options}
                  selectWrapperStyles="w-full rounded-md ring-c_gray  py-2 px-2"
                  selectPanelStyles="ring-c_gray/40 shadow h-[70px]"
                  selected={selectedCategory}
                  setSelected={(option) => setSelectedCategory(option)}
                  selectLabel="Product Category"
                  selectLabelStyles="border text-base text-c_dark/50 rounded-full px-1"
                />
              ) : (
                <CheckBox
                  label="Allow VAT?"
                  checkLabelStyles="text-c_dark/50"
                  checkIconStyles="text-c_yellow"
                  isChecked={allowVAT}
                  setIsChecked={setAllowVAT}
                />
              )}
            </div>
          )
        )}

        <div className="absolute bottom-0  right-0">
          <Button
            title="Save"
            icon={<BsSave className="w-5 h-5 text-white" />}
            buttonStyles="flex items-center gap-x-2 px-4 py-2 bg-c_yellow rounded-xl text-white"
            buttonTitleWrapperStyles="hidden sm:block"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default Independent;
