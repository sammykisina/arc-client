import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useProduct } from "../../../../hooks";
import { Button, Select } from "../../..";
import { BsSave } from "react-icons/bs";
import { Notification } from "../../../../utils/notifications";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  globalProductState,
  isEditingProductState,
} from "../../../../atoms/ProductAtom";
import { showCreateOrEditProductState } from "../../../../atoms/ModalAtom";
import { useEffect } from "react";
import { createProductDecisionTabsIndexState } from "../../../../atoms/AppAtoms";

const Dependent = () => {
  /**
   * Component states
   */
  const {
    dependentProductInputs,
    generateCurrentlyAssignedProductNames,
    createProduct,
    updateProduct,
    getDependentProductEditData,
  } = useProduct();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isEditingProduct, setIsEditingProduct] = useRecoilState(
    isEditingProductState
  );
  const [globalProduct, setGlobalProduct] = useRecoilState(globalProductState);
  const setShowCreateOrEditProduct = useSetRecoilState(
    showCreateOrEditProductState
  );
  const setCreateProductDecisionTabsIndex = useSetRecoilState(
    createProductDecisionTabsIndexState
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
  const onSubmit = ({ name }) => {
    // validation
    if (selectedCategory === "")
      return Notification.errorNotification("Product category is required.");

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
      productEditData = getDependentProductEditData({ name, selectedCategory });

      if (Object.keys(productEditData).length === 0) {
        setGlobalProduct(null),
          setIsEditingProduct(false),
          Notification.errorNotification("Nothing to edit."),
          setShowCreateOrEditProduct(false),
          setCreateProductDecisionTabsIndex(0);

        return;
      }
    }

    // actual creating or editing of the product
    isEditingProduct
      ? updateProduct(productEditData, {
          name,
          selectedCategory,
        })
      : createProduct({
          name,
          category_id: selectedCategory?.value,
          form: "dependent",
        });

    setShowCreateOrEditProduct(false);
  };

  /**
   * set the inputs when editing
   */
  useEffect(() => {
    if (globalProduct) {
      reset({
        name: globalProduct?.attributes?.name,
      });

      if (globalProduct?.relationships?.category) {
        setSelectedCategory({
          name: globalProduct?.relationships?.category?.attributes?.name,
          value: globalProduct?.relationships?.category?.id,
        });
      }
    }
  }, [globalProduct]);

  return (
    <form
      className="mt-5 sm:mt-0 px-1 sm:pt-4 flex flex-col sm:grid grid-cols-2  gap-6 relative h-[180px] sm:h-[60px] sm:items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      {dependentProductInputs.map(
        (dependentProductInput, dependentProductInputIndex) => (
          <div key={dependentProductInputIndex}>
            {dependentProductInput.component === "Input" ? (
              <div className={`input-group`}>
                <input
                  type={dependentProductInput.type}
                  placeholder=""
                  {...register(dependentProductInput.name, {
                    required: dependentProductInput.required,
                  })}
                  className="input mt-1"
                />

                <label className="placeholder border">
                  {dependentProductInput.label}
                </label>

                {errors[dependentProductInput.name] && (
                  <span className="error">
                    {dependentProductInput.errorMessage}
                  </span>
                )}
              </div>
            ) : (
              <Select
                title=""
                options={dependentProductInput.options}
                selectWrapperStyles="w-full rounded-md ring-c_gray  py-2 px-2"
                selectPanelStyles="ring-c_gray/40 shadow h-[70px]"
                selected={selectedCategory}
                setSelected={(option) => setSelectedCategory(option)}
                selectLabel="Product Category"
                selectLabelStyles="border text-base text-c_dark/50 rounded-full px-1"
              />
            )}
          </div>
        )
      )}

      <div className="absolute bottom-0 sm:-bottom-[80px] right-0">
        <Button
          title="Save"
          icon={<BsSave className="w-5 h-5" />}
          buttonStyles="primary_button"
          type="submit"
        />
      </div>
    </form>
  );
};

export default Dependent;
