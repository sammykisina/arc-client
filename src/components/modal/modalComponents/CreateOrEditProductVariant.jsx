import { useEffect, useState } from "react";
import { BsSave } from "react-icons/bs";
import { useRecoilState, useSetRecoilState } from "recoil";
import { globalProductState } from "../../../atoms/ProductAtom";
import {
  globalProductVariantState,
  isEditingProductVariantState,
} from "../../../atoms/VariantAtom";
import { showCreateOrEditProductVariantModalState } from "../../../atoms/ModalAtom";
import {
  Button,
  CheckBox,
  ModalClose,
  ModalHeader,
  Select,
  Title,
} from "../../";
import { useForm } from "react-hook-form";
import { Notification } from "../../../utils/notifications";
import { useProductVariant } from "../../../hooks";

const CreateOrEditProductVariant = () => {
  /**
   * component states
   */
  const [isEditingProductVariant, setIsEditingProductVariant] = useRecoilState(
    isEditingProductVariantState
  );
  const [selectedProduct, setSelectedProduct] = useState("");
  const [allowVAT, setAllowVAT] = useState(true);
  const setShowCreateOrEditProductVariantModal = useSetRecoilState(
    showCreateOrEditProductVariantModalState
  );
  const [globalProductVariant, setGlobalProductVariant] = useRecoilState(
    globalProductVariantState
  );
  const [globalProduct, setGlobalProduct] = useRecoilState(globalProductState);
  const {
    productVariantInputs,
    getCurrentlyAssignedProductVariantNamesAndMeasurePair,
    createProductVariant,
    getProductVariantEditData,
    updateProductVariant,
  } = useProductVariant();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  /**
   * set the default values when editing
   */
  useEffect(() => {
    if (globalProductVariant) {
      setSelectedProduct({
        name: globalProduct?.attributes?.name,
        value: globalProduct?.id,
      });

      reset({
        name: globalProductVariant?.attributes?.name,
        cost: globalProductVariant?.attributes?.price?.cost.toString(),
        retail: globalProductVariant?.attributes?.price?.retail.toString(),
        initial_number_of_pieces:
          globalProductVariant?.attributes?.stock?.initial_number_of_pieces.toString(),
        measure: globalProductVariant?.attributes?.measure.toString(),
      });
    }
  }, [globalProductVariant]);

  /**
   * handle submit of new product variant details
   */
  const onSubmit = ({
    name,
    cost,
    retail,
    initial_number_of_pieces,
    measure,
  }) => {
    // validation
    if (selectedProduct === "")
      return Notification.errorNotification(
        "Select the product the variant belongs to."
      );

    // validate if a variant with the same name and the same measure is already created
    const isFound =
      getCurrentlyAssignedProductVariantNamesAndMeasurePair().some(
        (productVariantNamesAndMeasurePair) => {
          if (
            productVariantNamesAndMeasurePair.name === name &&
            productVariantNamesAndMeasurePair.measure === measure
          ) {
            return true;
          }
        }
      );

    if (!isEditingProductVariant && isFound) {
      Notification.errorNotification(
        "Such a variant exits.Change the name or the measure."
      );

      return;
    }

    // when editing
    let productVariantEditData = {};
    if (isEditingProductVariant) {
      productVariantEditData = getProductVariantEditData({
        name,
        cost,
        retail,
        initial_number_of_pieces,
        measure,
        selectedProduct,
      });

      if (Object.keys(productVariantEditData).length === 0) {
        setGlobalProductVariant(null),
          setGlobalProduct(null),
          setIsEditingProductVariant(false),
          Notification.errorNotification("Nothing to edit"),
          setShowCreateOrEditProductVariantModal(false);
        return;
      }
    }

    // actual creating or editing of the product variant
    isEditingProductVariant
      ? updateProductVariant(productVariantEditData, {
          name,
          cost,
          retail,
          initial_number_of_pieces,
          measure,
        })
      : createProductVariant({
          name,
          cost: parseInt(cost),
          retail: parseInt(retail),
          initial_number_of_pieces: parseInt(initial_number_of_pieces),
          measure: parseInt(measure),
          product_id: selectedProduct.value,
          vat: allowVAT,
        });

    setShowCreateOrEditProductVariantModal(false);
  };

  return (
    <section className="relative">
      {/* Headers */}
      <ModalHeader
        close={() => {
          setGlobalProductVariant(null),
            setIsEditingProductVariant(false),
            setShowCreateOrEditProductVariantModal(false);
        }}
        isEditing={isEditingProductVariant}
        editTitle="Editing Product Variant"
        createTitle="Creating A Product Variant"
      />

      {/* Body */}
      <form onSubmit={handleSubmit(onSubmit)} className="px-4 py-2">
        <section className="space-y-5 sm:space-y-0 gap-x-3 px-2 overflow-y-auto h-[340px] sm:h-[300px] sm:pb-2 sm:grid grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-c_yellow">
          {/* Product Variant General Info Section*/}
          <section className="space-y-4 col-span-2">
            <Title title="General Info." />

            <div className="space-y-4">
              {productVariantInputs[0].map(
                (productVariantInput, productVariantInputIndex) => (
                  <div key={productVariantInputIndex}>
                    {productVariantInput.component === "Select" ? (
                      <Select
                        title=""
                        options={productVariantInput.options}
                        selectWrapperStyles={`w-full rounded-md ring-c_gray py-2 px-2`}
                        selectPanelStyles="ring-c_gray/40 shadow h-[90px]"
                        selected={selectedProduct}
                        setSelected={(option) => setSelectedProduct(option)}
                        selectLabel={productVariantInput.label}
                        selectLabelStyles="border text-c_dark/50 rounded-full px-1"
                      />
                    ) : productVariantInput.component === "Input" ? (
                      <div className={`input-group`}>
                        <input
                          type={productVariantInput.type}
                          placeholder=""
                          {...register(productVariantInput.name, {
                            required: true,
                          })}
                          className="input"
                        />

                        <label className="placeholder border">
                          {productVariantInput.label}
                        </label>

                        {errors[productVariantInput.name] && (
                          <span className="error">
                            {productVariantInput.errorMessage}
                          </span>
                        )}
                      </div>
                    ) : (
                      <CheckBox
                        label="VAT"
                        checkLabelStyles="text-c_dark"
                        checkIconStyles="text-c_yellow"
                        isChecked={allowVAT}
                        setIsChecked={setAllowVAT}
                      />
                    )}
                  </div>
                )
              )}
            </div>
          </section>

          {/* Product Variant Prices Section */}
          <section className="space-y-4 col-span-3 py-2 sm:py-0 sm:px-2">
            <Title title="Prices." />

            <div className="space-y-5">
              {productVariantInputs[1].map(
                (productVariantInput, productVariantInputIndex) => (
                  <div className={`input-group`} key={productVariantInputIndex}>
                    <input
                      type={productVariantInput.type}
                      placeholder=""
                      {...register(productVariantInput.name, {
                        required: productVariantInput.required,
                      })}
                      className="input"
                    />

                    <label className="placeholder border">
                      {productVariantInput.label}
                    </label>

                    {errors[productVariantInput.name] && (
                      <span className="error">
                        {productVariantInput.errorMessage}
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

export default CreateOrEditProductVariant;
