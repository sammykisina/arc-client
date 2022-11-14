import { useCallback, useMemo } from "react";
import { BsCheck2Circle } from "react-icons/bs";
import { HiArrowNarrowRight, HiPlusSm } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { RiEditCircleFill } from "react-icons/ri";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ProductVariantAPI } from "../api/productVariantAPI";
import {
  showCreateOrEditProductVariantModalState,
  showDeleteProductVariantModalState,
} from "../atoms/ModalAtom";
import {
  allProductsFromDBState,
  globalProductState,
} from "../atoms/ProductAtom";
import {
  allProductVariantsFromDBState,
  globalProductVariantState,
  isEditingProductVariantState,
} from "../atoms/VariantAtom";
import { Icon, InteractiveButton } from "../components";
import {
  DeleteAction,
  EditAction,
  NumberCell,
  StatusPill,
  StockCell,
} from "../components/ui-reusable-small-components/table";
import { Notification } from "../utils/notifications";
import useProduct from "./useProduct";

const useProductVariant = () => {
  /**
   * Hook states
   */
  const { generateProductOptions } = useProduct();
  const [allProductVariantsFromDB, setAllProductVariantsFromDB] =
    useRecoilState(allProductVariantsFromDBState);
  const [allProductsFromDB, setAllProductsFromDB] = useRecoilState(
    allProductsFromDBState
  );
  const [globalProductVariant, setGlobalProductVariant] = useRecoilState(
    globalProductVariantState
  );
  const [globalProduct, setGlobalProduct] = useRecoilState(globalProductState);
  const setShowCreateOrEditProductVariantModal = useSetRecoilState(
    showCreateOrEditProductVariantModalState
  );
  const setShowDeleteProductVariant = useSetRecoilState(
    showDeleteProductVariantModalState
  );
  const setIsEditingProductVariant = useSetRecoilState(
    isEditingProductVariantState
  );

  const productVariantInputs = [
    [
      {
        name: "Product",
        label: "Product",
        options: generateProductOptions,
        component: "Select",
      },
      {
        name: "name",
        label: "Name",
        errorMessage: "Enter variant name",
        component: "Input",
        type: "text",
      },
      {
        name: "measure",
        label: "Measure",
        placeholder: "Measure",
        errorMessage: "Enter variant measure",
        component: "Input",
        type: "number",
      },
      {
        name: "initial_number_of_pieces",
        label: "Stock Quantity",
        errorMessage: "Enter variant number of pieces",
        component: "Input",
        type: "number",
      },
      {
        name: "VAT",
        label: "VAT",
        component: "CheckBox",
      },
    ],
    [
      {
        name: "cost",
        label: "Variant Buying Price",
        placeholder: "Cost",
        errorMessage: "Enter variant buying price",
        component: "Input",
        type: "number",
      },
      {
        name: "retail",
        label: "Variant Selling Price",
        placeholder: "Retail",
        errorMessage: "Enter variant selling price",
        component: "Input",
        type: "number",
      },
    ],
  ];

  const productVariantsTableColumns = useMemo(
    () => [
      {
        Header: "Variants",
        columns: [
          {
            Header: "Name",
            accessor: "name",
          },
          {
            Header: "Status",
            accessor: "status",
            Cell: StatusPill,
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
  const getAllProductVariantsFromDB = () => {
    ProductVariantAPI.getAll().then((productVariants) =>
      setAllProductVariantsFromDB(productVariants)
    );
  };

  const createProductVariant = (productVariantData) => {
    ProductVariantAPI.create(productVariantData).then((response) => {
      if (response.error === 1)
        Notification.errorNotification(response.message);
      else {
        const ownerProduct = allProductsFromDB?.find(
          (productFromDB) => productFromDB?.id === productVariantData.product_id
        );

        const newProducts = allProductsFromDB.map((productFromDB) =>
          productFromDB?.id === ownerProduct?.id
            ? {
                ...ownerProduct,
                relationships: {
                  ...ownerProduct?.relationships,
                  variants: [
                    ...ownerProduct?.relationships?.variants,
                    {
                      ...response?.variant,
                      attributes: {
                        ...response?.variant?.attributes,
                        active: true,
                        inventory: {
                          ...response?.variant?.attributes?.inventory,
                          sold: 0,
                        },
                      },
                    },
                  ],
                },
              }
            : productFromDB
        );

        setAllProductsFromDB(newProducts);
        Notification.successNotification(response.message);
      }
    });
  };

  const updateProductVariant = (productVariantEditData, newData) => {
    ProductVariantAPI.update(
      globalProductVariant?.attributes?.uuid,
      productVariantEditData
    ).then((response) => {
      if (response.error === 1) Notification.errorNotification(response.error);
      else {
        const productVariantBeingEdited =
          globalProduct?.relationships?.variants.find(
            (variant) =>
              variant?.attributes?.uuid ===
              globalProductVariant?.attributes?.uuid
          );

        const updatedVariants = globalProduct?.relationships?.variants.map(
          (variant) =>
            variant?.attributes?.uuid ===
            productVariantBeingEdited?.attributes?.uuid
              ? {
                  ...productVariantBeingEdited,
                  attributes: {
                    ...productVariantBeingEdited?.attributes,
                    name: newData.name,
                    price: {
                      cost: newData.cost,
                      retail: newData.retail,
                    },
                    inventory: {
                      ...productVariantBeingEdited?.attributes?.inventory,
                      stock: newData.initial_number_of_pieces,
                      store: newData.initial_number_of_pieces,
                    },
                    measure: newData.measure,
                  },
                }
              : variant
        );

        setAllProductsFromDB(
          allProductsFromDB.map((productFromDB) =>
            productFromDB?.attributes?.uuid === globalProduct?.attributes?.uuid
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
        Notification.successNotification(response.message);
      }

      setGlobalProduct(null),
        setIsEditingProductVariant(false),
        setGlobalProductVariant(null),
        setShowCreateOrEditProductVariantModal(false);
    });
  };

  const deleteProductVariant = () => {
    ProductVariantAPI.delete(globalProductVariant?.attributes?.uuid).then(
      (response) => {
        if (response.error === 1)
          Notification.errorNotification(response.message);
        else {
          const newVariants = globalProduct?.relationships?.variants.filter(
            (variant) =>
              variant?.attributes?.uuid !==
              globalProductVariant?.attributes?.uuid
          );

          setAllProductsFromDB(
            allProductsFromDB.map((productFromDB) =>
              productFromDB?.attributes?.uuid ===
              globalProduct?.attributes?.uuid
                ? {
                    ...globalProduct,
                    relationships: {
                      ...globalProduct?.relationships,
                      variants: newVariants,
                    },
                  }
                : productFromDB
            )
          );

          Notification.successNotification(response.message);
        }

        setGlobalProduct(null),
          setGlobalProductVariant(null),
          setIsEditingProductVariant(false);
      }
    );
  };

  const getCurrentlyAssignedProductVariantNamesAndMeasurePair = () => {
    const productVariantNamesAndMeasurePair = new Set();

    allProductVariantsFromDB.forEach((productVariantFromDB) => {
      productVariantNamesAndMeasurePair.add({
        name: productVariantFromDB?.attributes?.name,
        measure: productVariantFromDB?.attributes?.measure.toString(),
      });
    });

    return [...productVariantNamesAndMeasurePair.values()];
  };

  const getProductVariantEditData = (editData) => {
    let productVariantEditData = {};

    if (globalProductVariant?.attributes?.name != editData.name)
      productVariantEditData = {
        ...productVariantEditData,
        name: editData.name,
      };

    if (globalProductVariant?.attributes?.price?.cost != editData.cost)
      productVariantEditData = {
        ...productVariantEditData,
        cost: editData.cost,
      };

    if (globalProductVariant?.attributes?.price?.retail != editData.retail)
      productVariantEditData = {
        ...productVariantEditData,
        retail: editData.retail,
      };

    if (editData.initial_number_of_pieces != "")
      productVariantEditData = {
        ...productVariantEditData,
        stoke: editData.initial_number_of_pieces,
        store: editData.initial_number_of_pieces,
      };

    if (globalProductVariant?.attributes?.measure != editData.measure)
      productVariantEditData = {
        ...productVariantEditData,
        measure: editData.measure,
      };

    if (globalProduct?.id != editData.selectedProduct.value)
      productVariantEditData = {
        ...productVariantEditData,
        product_id: editData.selectedProduct.value,
      };

    return productVariantEditData;
  };

  const getProductVariantsDataForProductVariantsTable = useCallback(
    (productVariants, product) => {
      let productVariantsData = [];

      productVariants?.forEach((productVariant) => {
        productVariantsData = [
          ...productVariantsData,
          {
            name: productVariant?.attributes?.name,
            uuid: productVariant?.attributes?.uuid,
            cost: productVariant?.attributes?.price?.cost,
            retail: productVariant?.attributes?.price?.retail,
            stock: productVariant?.attributes?.inventory?.stock,
            store: productVariant?.attributes?.inventory?.store,
            sold: productVariant?.attributes?.inventory?.sold,
            category: "_",
            measure: productVariant?.attributes?.measure,
            status: productVariant?.attributes?.active ? "active" : "inactive",
            vat: (
              <Icon
                icon={
                  productVariant?.attributes?.vat ? (
                    <BsCheck2Circle className="text-c_green w-4 h-4" />
                  ) : (
                    <BsCheck2Circle className="text-red-400 w-4 h-4" />
                  )
                }
              />
            ),
            actions: [
              <div
                className="flex gap-x-3 items-center"
                key={productVariant?.attributes?.uuid}
              >
                <DeleteAction
                  purpose={() => {
                    setGlobalProductVariant(productVariant),
                      setGlobalProduct(product),
                      setShowDeleteProductVariant(true);
                  }}
                />
                <EditAction
                  purpose={() => {
                    setGlobalProductVariant(productVariant),
                      setGlobalProduct(product),
                      setIsEditingProductVariant(true),
                      setShowCreateOrEditProductVariantModal(true);
                  }}
                />
                <InteractiveButton
                  title="Stock"
                  buttonWrapperStyles={`text-center py-1 px-4 bg-c_yellow rounded-full text-white w-fit text-xs uppercase`}
                  arrowsPosition="left"
                  defaultIcon={<HiPlusSm />}
                  hoverIcon={<HiArrowNarrowRight />}
                  purpose={() => {}}
                />
              </div>,
            ],
          },
        ];
      });

      return productVariantsData;
    }
  );

  return {
    productVariantInputs,
    getCurrentlyAssignedProductVariantNamesAndMeasurePair,
    createProductVariant,
    getProductVariantEditData,
    updateProductVariant,
    productVariantsTableColumns,
    getAllProductVariantsFromDB,
    getProductVariantsDataForProductVariantsTable,
    deleteProductVariant,
  };
};

export default useProductVariant;
