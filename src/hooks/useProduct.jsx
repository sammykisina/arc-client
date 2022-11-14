import { useMemo, useState } from "react";
import { BsCheck2Circle } from "react-icons/bs";
import { HiArrowNarrowRight, HiChevronDown, HiPlusSm } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { RiEditCircleFill } from "react-icons/ri";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ProductAPI } from "../api/productAPI";
import { createProductDecisionTabsIndexState } from "../atoms/AppAtoms";
import {
  showCreateOrEditProductState,
  showDeleteProductModalState,
} from "../atoms/ModalAtom";
import {
  allProductsFromDBState,
  globalProductState,
  isEditingProductState,
} from "../atoms/ProductAtom";
import { Icon, InteractiveButton } from "../components";
import {
  CategoryFilter,
  DeleteAction,
  EditAction,
  NumberCell,
  StatusFilter,
  StatusPill,
  StockCell,
} from "../components/ui-reusable-small-components/table";
import { Notification } from "../utils/notifications";
import useCategory from "./useCategory";

const useProduct = () => {
  /**
   * Hook states
   */
  const [isCreatingProductWithVariants, setIsCreatingProductWithVariants] =
    useState(false);
  const { generateCategoryOptions } = useCategory();
  const [allProductsFromDB, setAllProductsFromDB] = useRecoilState(
    allProductsFromDBState
  );
  const [globalProduct, setGlobalProduct] = useRecoilState(globalProductState);
  const setIsEditingProduct = useSetRecoilState(isEditingProductState);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const setShowCreateOrEditProduct = useSetRecoilState(
    showCreateOrEditProductState
  );
  const setShowDeleteProductModal = useSetRecoilState(
    showDeleteProductModalState
  );
  const [createProductDecisionTabsIndex, setCreateProductDecisionTabsIndex] =
    useRecoilState(createProductDecisionTabsIndexState);

  const dependentProductInputs = [
    {
      name: "name",
      label: "Name",
      errorMessage: "Enter product name",
      component: "Input",
      type: "text",
      required: true,
    },
    {
      name: "category",
      label: "Category",
      errorMessage: "Choose product category",
      options: generateCategoryOptions,
      component: "Select",
    },
  ];

  const independentProductInputs = [
    [
      {
        name: "name",
        label: "Name",
        errorMessage: "Enter product name.",
        component: "Input",
        type: "text",
        required: true,
      },
      {
        name: "category",
        label: "Category",
        options: generateCategoryOptions,
        component: "Select",
      },
      {
        name: "measure",
        label: "Measure",
        errorMessage: "Enter product measure.",
        component: "Input",
        type: "number",
        required: true,
      },
      {
        name: "initial_number_of_pieces",
        label: "Stock Quantity",
        errorMessage: "Enter number of pieces.",
        component: "Input",
        type: "number",
        readonly:
          globalProduct?.attributes?.inventory?.store !=
          globalProduct?.attributes?.inventory?.stock
            ? true
            : false,
        required:
          globalProduct?.attributes?.inventory?.store ===
          globalProduct?.attributes?.inventory?.stock
            ? true
            : false,
      },
    ],
    [
      {
        name: "cost",
        label: "Buying Price",
        errorMessage: "Enter product buying price.",
        component: "Input",
        type: "number",
        gap: true,
        required: true,
      },
      {
        name: "retail",
        label: "Selling Price",
        errorMessage: "Enter product selling price.",
        component: "Input",
        type: "number",
        required: true,
      },
    ],
  ];

  const productsTableColumns = useMemo(
    () => [
      {
        Header: () => null,
        id: "expander",
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
            <Icon
              icon={
                <HiChevronDown
                  className={`icon text-c_dark hover:bg-c_green_light rounded-full duration-300 ${
                    row.isExpanded ? "" : "-rotate-90"
                  } `}
                />
              }
            />
          </span>
        ),
      },
      {
        Header: "Products",
        columns: [
          {
            Header: "Name",
            accessor: "name",
          },
          {
            Header: "Category",
            accessor: "category",
            Filter: CategoryFilter,
            filter: "include",
          },
          {
            Header: "Status",
            accessor: "status",
            Cell: StatusPill,
            Filter: StatusFilter,
            filter: "include",
          },
          {
            Header: "Cost (BP)",
            accessor: "cost",
            Cell: NumberCell,
          },
          {
            Header: "Retail (SP)",
            accessor: "retail",
            Cell: NumberCell,
          },
          {
            Header: "Stock",
            accessor: "stock",
            Cell: StockCell,
          },
          {
            Header: "Store",
            accessor: "store",
            Cell: StockCell,
          },
          {
            Header: "Sold",
            accessor: "sold",
            Cell: StockCell,
          },
          {
            Header: "Measure",
            accessor: "measure",
            Cell: NumberCell,
          },
          {
            Header: "VAT",
            accessor: "vat",
          },
          {
            Header: "Actions",
            accessor: "actions",
          },
        ],
      },
    ],
    []
  );

  /**
   * Hook functions
   */

  const getAllProductsFromDB = () => {
    setIsFetchingProducts(true);
    ProductAPI.getAll()
      .then((products) => setAllProductsFromDB(products))
      .finally(() => setIsFetchingProducts(false));
  };

  const createProduct = (productData) => {
    ProductAPI.create(productData).then((response) => {
      if (response.error === 1)
        Notification.errorNotification(response.message);
      else {
        setAllProductsFromDB([response.product, ...allProductsFromDB]),
          Notification.successNotification(response.message);
      }
    });
  };

  const updateProduct = (editProductData, newData) => {
    ProductAPI.update(globalProduct?.attributes?.uuid, editProductData).then(
      (response) => {
        if (response.error === 1)
          Notification.errorNotification(response.message);
        else {
          const productBeingEdited = allProductsFromDB.find(
            (productFromDB) =>
              productFromDB?.attributes?.uuid ===
              globalProduct?.attributes?.uuid
          );

          const updatedProducts = allProductsFromDB.map((productFromDB) =>
            productFromDB?.attributes?.uuid ===
            productBeingEdited?.attributes?.uuid
              ? createProductDecisionTabsIndex === 1
                ? {
                    ...productBeingEdited,
                    attributes: {
                      ...productBeingEdited?.attributes,
                      name: newData.name,
                    },
                    relationships: {
                      ...productBeingEdited?.relationships,
                      category: {
                        ...productBeingEdited?.relationships?.category,
                        attributes: {
                          ...productBeingEdited?.relationships?.attributes,
                          name: newData.selectedCategory.name,
                        },
                      },
                    },
                  }
                : {
                    ...productBeingEdited,
                    attributes: {
                      ...productBeingEdited?.attributes,
                      name: newData.name,
                      price: {
                        cost: newData.cost,
                        retail: newData.retail,
                      },
                      inventory: {
                        ...productBeingEdited?.attributes?.inventory,
                        stock:
                          newData.initial_number_of_pieces != ""
                            ? newData.initial_number_of_pieces
                            : productBeingEdited?.attributes?.inventory?.stock,
                        store:
                          newData.initial_number_of_pieces != ""
                            ? newData.initial_number_of_pieces
                            : productBeingEdited?.attributes?.inventory?.store,
                      },
                      measure: newData.measure,
                      vat: newData.allowVAT,
                    },
                    relationships: {
                      ...productBeingEdited?.relationships,
                      category: {
                        ...productBeingEdited?.relationships?.category,
                        attributes: {
                          ...productBeingEdited?.relationships?.attributes,
                          name: newData.selectedCategory.name,
                        },
                      },
                    },
                  }
              : productFromDB
          );

          setAllProductsFromDB(updatedProducts);
          Notification.successNotification(response.message);
        }

        setCreateProductDecisionTabsIndex(0),
          setIsEditingProduct(false),
          setGlobalProduct(null);
      }
    );
  };

  const deleteProduct = () => {
    ProductAPI.delete(globalProduct?.attributes?.uuid).then((response) => {
      if (response.error === 1)
        Notification.errorNotification(response.message);
      else {
        const newProducts = allProductsFromDB.filter(
          (productFromDB) =>
            productFromDB?.attributes?.uuid !== globalProduct?.attributes?.uuid
        );

        setAllProductsFromDB(newProducts);
        Notification.successNotification(response.message);
      }
    });
  };

  const getDependentProductEditData = ({ name, selectedCategory }) => {
    let productEditData = {};

    if (globalProduct?.attributes?.name != name)
      productEditData = {
        ...productEditData,
        name,
      };

    if (globalProduct?.relationships?.category?.id != selectedCategory.value)
      productEditData = {
        ...productEditData,
        category_id: selectedCategory.value,
      };

    return productEditData;
  };

  const getIndependentProductEditData = ({
    name,
    cost,
    retail,
    initial_number_of_pieces,
    measure,
    selectedCategory,
    allowVAT,
  }) => {
    let productEditData = {};

    if (globalProduct?.attributes?.name != name)
      productEditData = {
        ...productEditData,
        name,
      };

    if (globalProduct?.attributes?.price?.cost != cost)
      productEditData = {
        ...productEditData,
        cost: cost,
      };

    if (globalProduct?.attributes?.price?.retail != retail)
      productEditData = {
        ...productEditData,
        retail: retail,
      };

    if (
      globalProduct?.attributes?.inventory?.stock ===
        globalProduct?.attributes?.inventory?.store &&
      initial_number_of_pieces != ""
    ) {
      productEditData = {
        ...productEditData,
        stock: initial_number_of_pieces,
        store: initial_number_of_pieces,
      };
    }

    if (globalProduct?.attributes?.measure != measure)
      productEditData = {
        ...productEditData,
        measure: measure,
      };

    if (globalProduct?.relationships?.category?.id != selectedCategory.value)
      productEditData = {
        ...productEditData,
        category_id: selectedCategory.value,
      };

    if (globalProduct?.attributes?.vat != allowVAT)
      productEditData = {
        ...productEditData,
        vat: allowVAT,
      };

    return productEditData;
  };

  const generateCurrentlyAssignedProductNames = () => {
    const productNames = new Set();

    allProductsFromDB?.forEach((productFromDB) => {
      productNames.add(productFromDB?.attributes?.name);
    });

    return [...productNames.values()];
  };

  const getProductsDataForProductsTable = () => {
    let productsData = [];

    allProductsFromDB?.forEach((productFromDB) => {
      productsData = [
        ...productsData,
        {
          uuid: productFromDB?.attributes?.uuid,
          name: productFromDB?.attributes?.name,
          category: productFromDB?.relationships?.category?.attributes?.name,
          form: productFromDB?.attributes?.form,
          status: productFromDB?.attributes?.active ? "active" : "inactive",
          cost:
            productFromDB?.attributes?.form === "independent"
              ? productFromDB?.attributes?.price?.cost
              : "_",
          retail:
            productFromDB?.attributes?.form === "independent"
              ? productFromDB?.attributes?.price?.retail
              : "_",
          stock: productFromDB?.attributes?.inventory?.stock,
          store: productFromDB?.attributes?.inventory?.store,
          sold: productFromDB?.attributes?.inventory?.sold,
          measure: productFromDB?.attributes?.measure,
          vat:
            productFromDB?.attributes?.form === "independent" ? (
              <Icon
                icon={
                  productFromDB?.attributes?.vat ? (
                    <BsCheck2Circle className="text-c_green w-4 h-4" />
                  ) : (
                    <BsCheck2Circle className="text-red-400 w-4 h-4" />
                  )
                }
              />
            ) : (
              "_"
            ),
          product: productFromDB,
          variants:
            productFromDB?.relationships?.variants.length > 0 &&
            productFromDB?.relationships?.variants,
          actions: [
            <div
              className="flex gap-x-3 items-center"
              key={productFromDB?.attributes?.uuid}
            >
              <DeleteAction
                purpose={() => {
                  setGlobalProduct(productFromDB),
                    setShowDeleteProductModal(true);
                }}
              />

              <EditAction
                purpose={() => {
                  setGlobalProduct(productFromDB),
                    setIsEditingProduct(true),
                    productFromDB?.attributes?.form === "independent"
                      ? setCreateProductDecisionTabsIndex(0)
                      : setCreateProductDecisionTabsIndex(1),
                    setShowCreateOrEditProduct(true);
                }}
              />
              {productFromDB?.attributes?.form === "independent" && (
                <InteractiveButton
                  title="Stock"
                  buttonWrapperStyles={`text-center py-1 px-4 bg-c_yellow rounded-full text-white w-fit text-xs uppercase`}
                  arrowsPosition="left"
                  defaultIcon={<HiPlusSm />}
                  hoverIcon={<HiArrowNarrowRight />}
                  purpose={() => {}}
                />
              )}
            </div>,
          ],
        },
      ];
    });

    return productsData;
  };

  const generateProductOptions = useMemo(() => {
    const productOptions = new Set();

    const dependentProducts = allProductsFromDB.filter(
      (productFromDB) => productFromDB?.attributes?.form === "dependent"
    );

    dependentProducts?.forEach((dependedProduct) => {
      productOptions.add({
        name: dependedProduct?.attributes?.name,
        value: dependedProduct?.id,
      });
    });

    return [...productOptions.values()];
  }, [allProductsFromDB]);

  return {
    independentProductInputs,
    setIsCreatingProductWithVariants,
    isCreatingProductWithVariants,
    getAllProductsFromDB,
    isFetchingProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    generateCurrentlyAssignedProductNames,
    productsTableColumns,
    getProductsDataForProductsTable,
    generateProductOptions,
    dependentProductInputs,
    getDependentProductEditData,
    getIndependentProductEditData,
  };
};

export default useProduct;
