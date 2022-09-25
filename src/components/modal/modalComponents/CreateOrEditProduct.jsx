// react framework imports
import React, { useEffect, useMemo, useState } from "react";

// icon imports {react icons}
import { BsSave } from "react-icons/bs";

// recoil imports {recoil and atoms}
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { allCategoriesFromDBState } from "../../../atoms/CategoryAtom";
import { showCreateOrEditProductState } from "../../../atoms/ModalAtoms";
import {
  allProductsFromDBState,
  globalProductState,
  isEditingProductState,
} from "../../../atoms/ProductAtom";

// api layer imports
import { ProductAPI } from "../../../api/productAPI";

// all components imports {local and packages}
import { useForm } from "react-hook-form";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  Switch,
} from "@material-tailwind/react";
import { Button, CheckBox, Line, Select, Title } from "../../";
import { Notification } from "../../../utils/notifications";
import {
  getCurrentAssignedProductNames,
  getProductEditData,
} from "../../../utils/product";
import ctr from "@netlify/classnames-template-literals";

const CreateOrEditProduct = () => {
  // component states
  const [isEditingProduct, setIsEditingProduct] = useRecoilState(
    isEditingProductState
  );
  const [isCreatingProductWithVariants, setIsCreatingProductWithVariants] =
    useState(false);
  const [allProductsFromDB, setAllProductsFromDB] = useRecoilState(
    allProductsFromDBState
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const allCategoriesFromDB = useRecoilValue(allCategoriesFromDBState);
  const [selectedCategory, setSelectedCategory] = useState("");
  const setShowCreateOrEditProduct = useSetRecoilState(
    showCreateOrEditProductState
  );
  const [allowVAT, setAllowVAT] = useState(true);
  const [globalProduct, setGlobalProduct] = useRecoilState(globalProductState);

  /**
   * create product decision tabs
   */
  const createProductDecisionTabs = [
    {
      label: "Without Variants",
      value: "create_product_with_no_variants",
    },
    {
      label: "With Variants",
      value: "create_product_with_variants",
    },
  ];

  // component functions

  /**
   * create category options to be used when creating products
   */
  const categoryOptions = useMemo(() => {
    const options = new Set();

    allCategoriesFromDB?.forEach((categoryFromDB) => {
      options.add({
        name: categoryFromDB?.attributes?.name,
        value: categoryFromDB?.id,
      });
    });

    return [...options.values()];
  }, [allCategoriesFromDB]);

  /**
   * product input fields
   */
  const productInputs = [
    {
      name: "name",
      label: "Product Name",
      errorMessage: "enter product name",
      component: "Input",
      type: "text",
      extraClasses: isCreatingProductWithVariants && "mt-14 sm:mt-2",
    },
    {
      name: "cost",
      label: "Product Buying Price",
      errorMessage: "enter product buying price",
      component: "Input",
      type: "number",
      gap: true,
      extraClasses: isCreatingProductWithVariants ? "hidden" : "block",
    },
    {
      name: "retail",
      label: "Product Selling Price",
      errorMessage: "enter product selling price",
      component: "Input",
      type: "number",
      extraClasses: isCreatingProductWithVariants ? "hidden" : "block",
    },
    {
      name: "initial_number_of_pieces",
      label: "Product Stock Quantity",
      errorMessage: "enter product number of pieces",
      component: "Input",
      type: "number",
      gap: true,
      extraClasses: isCreatingProductWithVariants ? "hidden" : "block",
    },
    {
      name: "measure",
      label: "Product Measure",
      errorMessage: "enter product measure",
      component: "Input",
      type: "number",
      extraClasses: isCreatingProductWithVariants ? "hidden" : "block",
    },
    {
      name: "category",
      label: "Product Category",
      errorMessage: "choose product category",
      options: categoryOptions,
      component: "Select",
      type: "text",
      gap: true,
    },
    {
      name: "vat",
      component: "Switch",
      type: "radio",
      extraClasses: isCreatingProductWithVariants ? "hidden" : "block",
    },
  ];

  /**
   * handle submit of new product details
   */
  const onSubmit = ({
    name,
    cost,
    retail,
    initial_number_of_pieces,
    measure,
  }) => {
    let editData = {};
    // validation of the input
    const validate = (
      name,
      cost,
      retail,
      measure,
      selectedCategory,
      isCreatingProductWithVariants
    ) => {
      // validation when creating a product without variants
      if (!isCreatingProductWithVariants) {
        if (cost.trim() === "")
          Notification.errorNotification("Product buying price is required");
        if (retail.trim() === "")
          Notification.errorNotification("Product selling price is required");
        if (measure.trim() === "")
          Notification.errorNotification("Product measure is required");
      }

      // common input validation
      if (name.trim() === "")
        Notification.errorNotification("Product name is required");
      if (selectedCategory.value === undefined)
        Notification.errorNotification("Product category is required");

      return;
    };
    validate(
      name,
      cost,
      retail,
      measure,
      selectedCategory,
      isCreatingProductWithVariants
    );

    // validating if the given product name has been given to another product
    if (
      !isEditingProduct &&
      getCurrentAssignedProductNames(allProductsFromDB).includes(name)
    ) {
      Notification.errorNotification("The given product name has been taken");

      return;
    }

    // get the edit data when editing
    if (isEditingProduct) {
      editData = getProductEditData(
        globalProduct,
        name,
        cost,
        retail,
        initial_number_of_pieces,
        measure,
        selectedCategory,
        allowVAT,
        isCreatingProductWithVariants
      );
      // if there are no values to edit
      if (Object.keys(editData).length === 0) {
        setGlobalProduct(null);
        setIsEditingProduct(false);
        Notification.errorNotification("Nothing to edit");
        setShowCreateOrEditProduct(false);
        return;
      }
    }

    // console.log("edit data", editData);
    // return;

    // actual creating or editing of products
    isEditingProduct
      ? ProductAPI.update(globalProduct?.attributes?.uuid, editData).then(
          (response) => {
            // updating the product

            // find the product we are editing
            const editedProduct = allProductsFromDB.find(
              (productFromDB) =>
                productFromDB?.attributes?.uuid ===
                globalProduct?.attributes?.uuid
            );

            // creating a new updated array of all products
            const updatedProducts = allProductsFromDB.map((productFromDB) =>
              productFromDB?.attributes?.uuid ===
              editedProduct?.attributes?.uuid
                ? isCreatingProductWithVariants
                  ? {
                      ...editedProduct,
                      attributes: {
                        ...editedProduct?.attributes,
                        name: name,
                      },
                      relationships: {
                        ...editedProduct?.relationships,
                        category: {
                          ...editedProduct?.relationships?.category,
                          attributes: {
                            ...editedProduct?.relationships?.attributes,
                            name: selectedCategory.name,
                          },
                        },
                      },
                    }
                  : {
                      ...editedProduct,
                      attributes: {
                        ...editedProduct?.attributes,
                        name: name,
                        price: {
                          cost: cost,
                          retail: retail,
                        },
                        stock: {
                          ...editedProduct?.attributes?.inventory,
                          stock: initial_number_of_pieces,
                          store: initial_number_of_pieces,
                        },
                        measure: measure,
                        vat: allowVAT,
                      },
                      relationships: {
                        ...editedProduct?.relationships,
                        category: {
                          ...editedProduct?.relationships?.category,
                          attributes: {
                            ...editedProduct?.relationships?.attributes,
                            name: selectedCategory.name,
                          },
                        },
                      },
                    }
                : productFromDB
            );

            // set the new products
            setAllProductsFromDB(updatedProducts);

            // refresh the browser to remove the updated employee  data from the Ui
            if (response.error === 1) window.location.reload(false);

            response.error === 1
              ? Notification.errorNotification(response.message)
              : Notification.successNotification(response.message);
          }
        )
      : ProductAPI.create(
          isCreatingProductWithVariants
            ? {
                name: name,
                category_id: selectedCategory?.value,
                form: "dependent",
              }
            : {
                name: name,
                cost: parseInt(cost),
                retail: parseInt(retail),
                initial_number_of_pieces: parseInt(initial_number_of_pieces),
                measure: parseInt(measure),
                category_id: selectedCategory?.value,
                vat: allowVAT,
                form: "independent",
              }
        ).then((response) => {
          // adding the created product in the UI
          setAllProductsFromDB([...allProductsFromDB, response.product]);

          // refresh the browser to remove the added product from the ui
          if (response?.error === 1) window.location.reload(false);

          // notifications
          response.error === 1
            ? Notification.errorNotification(response.message)
            : Notification.successNotification(response.message);
        });

    // reset states
    setIsEditingProduct(false);
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
        measure:
          globalProduct?.attributes?.form === "independent"
            ? globalProduct?.attributes?.measure.toString()
            : "",
      });

      setSelectedCategory({
        name: globalProduct?.relationships?.category?.attributes?.name,
        value: globalProduct?.relationships?.category?.id,
      });

      setAllowVAT(globalProduct?.attributes?.vat);
      setIsCreatingProductWithVariants(
        globalProduct?.attributes?.form === "independent" ? false : true
      );
    }
  }, [globalProduct]);

  return (
    <section className="relative h-full">
      <Title
        title={
          isEditingProduct
            ? "Edit Product. (Warning! The original info will be lost.)"
            : "Create a Product."
        }
      />
      <Line lineStyles="bg-c_yellow/100 w-[25px] h-[2px]" />

      {globalProduct && globalProduct?.attributes?.form === "independent" ? (
        <Title
          title={
            isEditingProduct
              ? "If updating the stock quantity, please use the update stock action instead."
              : ""
          }
          titleStyles="text-red-500 text-center text-xs"
        />
      ) : (
        ""
      )}
      {/* decision tabs */}
      <Tabs id="custom-animation" value="create_product_with_no_variants">
        <TabsHeader className={isEditingProduct ? "hidden" : "flex"}>
          {createProductDecisionTabs.map(({ label, value }) => (
            <Tab
              key={value}
              value={value}
              onClick={() =>
                setIsCreatingProductWithVariants(
                  (previousIsCreatingProductWithVariants) =>
                    !previousIsCreatingProductWithVariants
                )
              }
            >
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {/* fields */}
          <div className="sm:flex justify-center items-center">
            <form className={formStyles} onSubmit={handleSubmit(onSubmit)}>
              {productInputs.map((productInput, productInputIndex) => (
                <div
                  key={productInputIndex}
                  className={`h-fit ${productInput.gap && "mt-5 sm:mt-0 "}`}
                >
                  {productInput.component === "Input" ? (
                    <div
                      className={`input-group w-[250px] sm:w-[220px] md:w-[240px] ${productInput.extraClasses}`}
                    >
                      <input
                        type={productInput.type}
                        placeholder=""
                        {...register(productInput.name)}
                        className="input"
                      />

                      <label className="placeholder">
                        {productInput.label}
                      </label>

                      {errors[productInput.name] && (
                        <span className="error">
                          {productInput.errorMessage}
                        </span>
                      )}
                    </div>
                  ) : productInput.component === "Select" ? (
                    <div className="input-group w-[250px] sm:w-[220px] md:w-[240px]">
                      <div className="input">
                        <Select
                          title="-"
                          options={productInput?.options}
                          selected={selectedCategory}
                          setSelected={setSelectedCategory}
                        />
                      </div>

                      <label className="placeholder">
                        {productInput.label}
                      </label>
                    </div>
                  ) : (
                    <div
                      className={`ml-2 sm:ml-4 w-[250px] sm:w-[200px] md:w-[240px] ${productInput.extraClasses}`}
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
              ))}

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
        </TabsBody>
      </Tabs>
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
  py-8
  sm:py-5
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
  bottom-[0px] 
  sm:bottom-0 
  w-fit 
  right-0
`);

export default CreateOrEditProduct;
