// react framework imports
import { useEffect, useMemo, useState } from "react";

// icon imports {react icons}
import { BsSave } from "react-icons/bs";

// recoil imports {recoil and atoms}
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  allProductsFromDBState,
  globalProductState,
} from "../../../atoms/ProductAtom";
import {
  allProductVariantsFromDBState,
  globalProductVariantState,
  isEditingProductVariantState,
} from "../../../atoms/VariantAtom";
import { showCreateOrEditProductVariantModalState } from "../../../atoms/ModalAtoms";

// api layer imports
import { ProductVariantAPI } from "../../../api/productVariantAPI";

// all components imports {local and packages}
import { Button, CheckBox, Line, Select, Title } from "../../";
import { useForm } from "react-hook-form";
import { Notification } from "../../../utils/notifications";
import {
  getCurrentAssignedProductVariantNames,
  getProductVariantEditData,
} from "../../../utils/productVariant";
import ctr from "@netlify/classnames-template-literals";

const CreateOrEditProductVariant = () => {
  // component states
  const [allProductsFromDB, setAllProductsFromDB] = useRecoilState(
    allProductsFromDBState
  );
  const [isEditingProductVariant, setIsEditingProductVariant] = useRecoilState(
    isEditingProductVariantState
  );
  const [selectedProduct, setSelectedProduct] = useState("");
  const allProductVariantsFromDB = useRecoilValue(
    allProductVariantsFromDBState
  );
  const setShowCreateOrEditProductVariantModal = useSetRecoilState(
    showCreateOrEditProductVariantModalState
  );
  const [globalProductVariant, setGlobalProductVariant] = useRecoilState(
    globalProductVariantState
  );
  const [globalProduct, setGlobalProduct] = useRecoilState(globalProductState);
  const [allowVAT, setAllowVAT] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // component functions

  /**
   * create product options to be used when creating a product variant
   */
  const productOptions = useMemo(() => {
    const options = new Set();
    // getting the products that should contain variants
    const dependentProducts = allProductsFromDB.filter(
      (productFromDB) => productFromDB?.attributes?.form === "dependent"
    );
    dependentProducts?.forEach((dependentProduct) => {
      options.add({
        name: dependentProduct?.attributes?.name,
        value: dependentProduct?.id,
      });
    });

    return [...options.values()];
  }, [allProductsFromDB]);

  /**
   * product variant inputs
   */
  const productVariantInputs = [
    {
      name: "Product",
      label: "Variant Product",
      options: productOptions,
      component: "Select",
      type: "text",
      gap: true,
    },
    {
      name: "name",
      label: "Variant Name",
      placeholder: "Name",
      errorMessage: "Enter variant name",
      component: "Input",
      type: "text",
    },
    {
      name: "cost",
      label: "Variant Buying Price",
      placeholder: "Cost",
      errorMessage: "Enter variant buying price",
      component: "Input",
      type: "number",
      gap: true,
    },
    {
      name: "retail",
      label: "Variant Selling Price",
      placeholder: "Retail",
      errorMessage: "Enter variant selling price",
      component: "Input",
      type: "number",
    },
    {
      name: "initial_number_of_pieces",
      label: "Variant Stock Quantity",
      placeholder: "Number Of Pieces",
      errorMessage: "Enter variant number of pieces",
      component: "Input",
      type: "number",
      gap: true,
    },
    {
      name: "measure",
      label: "Variant Measure",
      placeholder: "Measure",
      errorMessage: "Enter variant measure",
      component: "Input",
      type: "number",
    },
    {
      name: "vat",
      component: "Switch",
      type: "radio",
    },
  ];

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
    let editData = {};
    // validation of the inputs {product}
    if (selectedProduct === "") {
      Notification.errorNotification(
        "Select the product the variant belongs to"
      );
      return;
    }

    // validate if the given name has been taken by another variant
    if (
      !isEditingProductVariant &&
      getCurrentAssignedProductVariantNames(allProductVariantsFromDB).includes(
        name
      )
    ) {
      Notification.errorNotification("The given variant name has been taken");

      return;
    }

    // get the edit data when editing
    if (isEditingProductVariant) {
      editData = getProductVariantEditData(
        globalProduct,
        globalProductVariant,
        name,
        cost,
        retail,
        initial_number_of_pieces,
        measure,
        selectedProduct
      );

      // if there are no values to edit
      if (Object.keys(editData).length === 0) {
        setGlobalProductVariant(null);
        setGlobalProduct(null);
        setIsEditingProductVariant(false);
        Notification.errorNotification("Nothing to edit");
        setShowCreateOrEditProductVariantModal(false);
        return;
      }
    }

    // actual creating or editing of the product variant
    isEditingProductVariant
      ? ProductVariantAPI.update(
          globalProductVariant?.attributes?.uuid,
          editData
        ).then((response) => {
          // editing the product variant
          if (response.error === 0) {
            // find the product variant we are editing
            const editedProductVariant =
              globalProduct?.relationships?.variants.find(
                (variant) =>
                  variant?.attributes?.uuid ===
                  globalProductVariant?.attributes?.uuid
              );

            // creating a new updated array of the variants
            const updatedVariants = globalProduct?.relationships?.variants.map(
              (variant) =>
                variant?.attributes?.uuid ===
                editedProductVariant?.attributes?.uuid
                  ? {
                      ...editedProductVariant,
                      attributes: {
                        ...editedProductVariant?.attributes,
                        name: name,
                        price: {
                          cost: cost,
                          retail: retail,
                        },
                        inventory: {
                          ...editedProductVariant?.attributes?.inventory,
                          stock: initial_number_of_pieces,
                          store: initial_number_of_pieces,
                        },
                        measure: measure,
                      },
                    }
                  : variant
            );

            //  update the products
            setAllProductsFromDB(
              allProductsFromDB.map((productFromDB) =>
                productFromDB?.attributes?.uuid ===
                globalProduct?.attributes?.uuid
                  ? {
                      ...globalProduct,
                      relationships: {
                        ...globalProduct?.relationships,
                        variants: updatedVariants,
                      },
                    }
                  : productFromDB
              )
            );
          }

          // notifications
          response.error === 1
            ? Notification.errorNotification(response.message)
            : Notification.successNotification(response?.message);

          // reset the states
          setGlobalProduct(null);
          setGlobalProductVariant(null);
          setIsEditingProductVariant(false);
          setShowCreateOrEditProductVariantModal(false);
        })
      : ProductVariantAPI.create({
          name: name,
          cost: parseInt(cost),
          retail: parseInt(retail),
          initial_number_of_pieces: parseInt(initial_number_of_pieces),
          measure: parseInt(measure),
          product_id: selectedProduct.value,
          vat: allowVAT,
        }).then((response) => {
          // adding the created variant product variant

          // find the product we are trying to create the variant for
          const product = allProductsFromDB.find(
            (productFromDB) => productFromDB?.id === selectedProduct.value
          );

          // appending the variant together with other product variants
          const newProducts = allProductsFromDB.map((productFromDB) =>
            productFromDB?.id === product?.id
              ? {
                  ...productFromDB,
                  relationships: {
                    ...productFromDB?.relationships,
                    variants: [
                      ...productFromDB?.relationships?.variants,
                      {
                        ...response.variant,
                        attributes: {
                          ...response.variant.attributes,
                          active: allowVAT,
                          inventory: {
                            ...response.variant.attributes?.inventory,
                            sold: 0,
                          },
                        },
                      },
                    ],
                  },
                }
              : productFromDB
          );

          // set the new products
          setAllProductsFromDB(newProducts);

          // refresh the browser to remove the added product variant from the ui
          response.error === 1
            ? window.location.reload(false)
            : Notification.successNotification(response.message);
        });

    // reset the states
    setIsEditingProductVariant(false);
    setShowCreateOrEditProductVariantModal(false);
  };

  return (
    <section className="relative h-full">
      <Title
        title={
          isEditingProductVariant
            ? "Edit Product Variant."
            : "Create a Product Variant."
        }
      />
      <Line lineStyles="bg-c_yellow/100 w-[25px] h-[2px]" />

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
                      checkIconsWrapper="bg-c_green_light rounded-full p-1"
                      checkIconStyles="text-c_green"
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
