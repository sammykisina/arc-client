import { useEffect, useState } from "react";
import { BsSave } from "react-icons/bs";
import { useRecoilState, useSetRecoilState } from "recoil";
import { globalProductState } from "../../../atoms/ProductAtom";
import {
  globalProductVariantState,
  isEditingProductVariantState,
} from "../../../atoms/VariantAtom";
import { showCreateOrEditProductVariantModalState } from "../../../atoms/ModalAtoms";
import { Button, CheckBox, Line, Select, Title } from "../../";
import { useForm } from "react-hook-form";
import { Notification } from "../../../utils/notifications";
import ctr from "@netlify/classnames-template-literals";
import { useProductVariant } from "../../../hooks";

const CreateOrEditProductVariant = () => {
  /**
   * component states
   */
  const [isEditingProductVariant, setIsEditingProductVariant] = useRecoilState(
    isEditingProductVariantState
  );
  const [selectedProduct, setSelectedProduct] = useState("");
  const setShowCreateOrEditProductVariantModal = useSetRecoilState(
    showCreateOrEditProductVariantModalState
  );
  const [globalProductVariant, setGlobalProductVariant] = useRecoilState(
    globalProductVariantState
  );
  const [globalProduct, setGlobalProduct] = useRecoilState(globalProductState);
  const [allowVAT, setAllowVAT] = useState(true);
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
    <section className="relative h-full">
      <Title
        title={
          isEditingProductVariant
            ? "Edit Product Variant."
            : "Create Product Variant."
        }
      />
      <Line lineStyles="bg-c_yellow/100 w-[25px] h-[5px] rounded-full" />

      <Title
        title={
          isEditingProductVariant
            ? "If updating the stock quantity, please use the update stock action instead."
            : ""
        }
        titleStyles="text-red-500 text-center text-xs"
      />

      {/* fields */}
      <div className="sm:flex justify-center items-center">
        <form className={formStyles} onSubmit={handleSubmit(onSubmit)}>
          {productVariantInputs.map(
            (productVariantInput, productVariantInputIndex) => (
              <div
                key={productVariantInputIndex}
                className={`h-fit ${
                  productVariantInput.gap && "mt-5 sm:mt-0 "
                }`}
              >
                {productVariantInput.component === "Select" ? (
                  <div className="input-group w-[250px] sm:w-[220px] md:w-[240px]">
                    <div className="input">
                      <Select
                        title="-"
                        options={productVariantInput.options}
                        selected={selectedProduct}
                        setSelected={setSelectedProduct}
                      />
                    </div>

                    <label className="placeholder">
                      {productVariantInput.label}
                    </label>
                  </div>
                ) : productVariantInput.component === "Input" ? (
                  <div
                    className={`input-group w-[250px] sm:w-[220px] md:w-[240px]`}
                  >
                    <input
                      type={productVariantInput.type}
                      placeholder=""
                      {...register(productVariantInput.name, {
                        required: true,
                      })}
                      className="input"
                    />

                    <label className="placeholder">
                      {productVariantInput.label}
                    </label>

                    {errors[productVariantInput.name] && (
                      <span className="error">
                        {productVariantInput.errorMessage}
                      </span>
                    )}
                  </div>
                ) : (
                  <div
                    className={`mt-1 ml-2 sm:ml-4 w-[250px] sm:w-[200px] md:w-[240px]`}
                  >
                    <CheckBox
                      label="VAT"
                      checkLabelStyles="text-c_dark"
                      checkIconStyles="text-c_yellow"
                      isChecked={allowVAT}
                      setIsChecked={setAllowVAT}
                    />
                  </div>
                )}
              </div>
            )
          )}

          <div className={btnWrapper}>
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
    </section>
  );
};

// styles
const formStyles = ctr(`
  sm:grid 
  grid-cols-2 
  overflow-auto 
  scrollbar-hide 
  flex 
  flex-col 
  items-center
  duration-300 
  gap-4
  h-[350px]
  w-full
  sm:h-[220px]
  sm:pt-2
  mt-2
  pt-5
  pl-1
`);

const btnWrapper = ctr(`
  mt-[30px] 
  sm:mt-10 
  px-3 
  sm:pr-9 
  flex 
  justify-end  
  absolute 
  -bottom-[0px] 
  sm:bottom-0 
  w-fit 
  right-0
`);

export default CreateOrEditProductVariant;
