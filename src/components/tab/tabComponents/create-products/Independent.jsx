import React, { useState } from "react";
import { useProduct } from "../../../../hooks";
import { Button, CheckBox, Select, Title } from "../../..";
import { useForm } from "react-hook-form";
import { BsSave } from "react-icons/bs";
import { Notification } from "../../../../utils/notifications";
import { showCreateOrEditProductState } from "../../../../atoms/ModalAtom";
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

      if (globalProduct?.relationships?.category) {
        setSelectedCategory({
          name: globalProduct?.relationships?.category?.attributes?.name,
          value: globalProduct?.relationships?.category?.id,
        });
      }

      setAllowVAT(globalProduct?.attributes?.vat);
    }
  }, [globalProduct]);

  return (
    <section className="relative">
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="space-y-5 sm:space-y-0 gap-x-3 px-2 overflow-y-auto h-[260px] sm:h-[200px] sm:pb-2 sm:grid grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-c_yellow">
          {/* Product General Info Section*/}
          <section className="space-y-4 col-span-2">
            <Title title="General Info." />

            <div className="space-y-5">
              {independentProductInputs[0].map(
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
                          className="input"
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
                    ) : (
                      <Select
                        title=""
                        options={independentProductInput.options}
                        selectWrapperStyles={`w-full rounded-md ring-c_gray  py-2 px-2`}
                        selectPanelStyles="ring-c_gray/40 shadow h-[90px]"
                        selected={selectedCategory}
                        setSelected={(option) => setSelectedCategory(option)}
                        selectLabel={independentProductInput.label}
                        selectLabelStyles="border text-c_dark/50 rounded-full px-1"
                      />
                    )}
                  </div>
                )
              )}
            </div>
          </section>

          {/* Product Prices Section */}
          <section className="space-y-3 col-span-3 py-2 sm:py-0 sm:px-2">
            <Title title="Prices." />

            <div className="space-y-4">
              {independentProductInputs[1].map(
                (independentProductInput, independentProductInputIndex) => (
                  <div
                    className={`input-group`}
                    key={independentProductInputIndex}
                  >
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
                )
              )}
            </div>
          </section>
        </section>

        {/* Delete  Btn*/}
        <div className="absolute -bottom-[60px] sm:bottom-0 sm:right-5  right-0 px-4 py-2">
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

export default Independent;
