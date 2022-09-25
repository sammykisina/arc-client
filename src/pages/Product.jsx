// react framework imports
import React, { useEffect, useMemo, useState } from "react";

// icon imports {react icons}
import { RiEditCircleFill } from "react-icons/ri";
import { BsCheck2All } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { HiChevronDown, HiPlus } from "react-icons/hi";

// recoil imports {recoil and atoms}
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  showCreateOrEditCategoryModalState,
  showCreateOrEditProductState,
  showCreateOrEditProductVariantModalState,
  showDeleteProductModalState,
  showDeleteProductVariantModalState,
} from "../atoms/ModalAtoms";
import {
  allCategoriesFromDBState,
  globalCategoryState,
  isCreatingCategoryState,
  isEditingCategoryState,
  showDeleteCategoryModalState,
} from "../atoms/CategoryAtom";
import {
  allProductsFromDBState,
  globalProductState,
  isEditingProductState,
} from "../atoms/ProductAtom";
import {
  allProductVariantsFromDBState,
  globalProductVariantState,
  isEditingProductVariantState,
} from "../atoms/VariantAtom";

// api layer imports
import { ProductAPI } from "../api/productAPI";
import { CategoryAPI } from "../api/categoryAPI";
import { ProductVariantAPI } from "../api/productVariantAPI";

// all components imports {local and packages}
import {
  CategoryFilter,
  StockCell,
  NameUuidCell,
  NumberCell,
  StatusFilter,
  StatusPill,
} from "../components/ui-reusable-small-components/table";
import { Button, Icon, SpinnerLoader, Table } from "../components";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { useCallback } from "react";

const Product = () => {
  // page states
  const [allProductsFromDB, setAllProductsFromDB] = useRecoilState(
    allProductsFromDBState
  );

  const [allCategoriesFromDB, setAllCategoriesFromDB] = useRecoilState(
    allCategoriesFromDBState
  );
  const setShowCreateOrEditProduct = useSetRecoilState(
    showCreateOrEditProductState
  );
  const setShowCreateOrEditCategoryModal = useSetRecoilState(
    showCreateOrEditCategoryModalState
  );
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const setIsCreatingCategory = useSetRecoilState(isCreatingCategoryState);
  const setIsEditingCategory = useSetRecoilState(isEditingCategoryState);
  const setGlobalCategory = useSetRecoilState(globalCategoryState);
  const setShowDeleteCategoryModal = useSetRecoilState(
    showDeleteCategoryModalState
  );
  const setShowDeleteProductModal = useSetRecoilState(
    showDeleteProductModalState
  );
  const setGlobalProduct = useSetRecoilState(globalProductState);
  const setIsEditingProduct = useSetRecoilState(isEditingProductState);
  const setShowCreateOrEditProductVariantModal = useSetRecoilState(
    showCreateOrEditProductVariantModalState
  );
  const setAllProductVariantsFromDB = useSetRecoilState(
    allProductVariantsFromDBState
  );
  const setGlobalProductVariant = useSetRecoilState(globalProductVariantState);
  const setShowDeleteProductVariant = useSetRecoilState(
    showDeleteProductVariantModalState
  );
  const setIsEditingProductVariant = useSetRecoilState(
    isEditingProductVariantState
  );

  /**
   * products table columns
   */
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
            Cell: NameUuidCell,
            uuidAccessor: "uuid",
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
   * productVariants table columns
   */
  const productVariantsTableColumns = useMemo(
    () => [
      {
        Header: "Variants",
        columns: [
          {
            Header: "Name",
            accessor: "name",
            Cell: NameUuidCell,
            uuidAccessor: "uuid",
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
   * categories table columns
   */
  const categoriesTableColumns = useMemo(
    () => [
      {
        Header: "Identification",
        columns: [
          {
            Header: "Name",
            accessor: "name",
            Cell: NameUuidCell,
            uuidAccessor: "uuid",
          },
        ],
      },
      {
        Header: "Info",
        columns: [
          {
            Header: "Description",
            accessor: "description",
          },
          {
            Header: "Status",
            accessor: "status",
            Cell: StatusPill,
            Filter: StatusFilter,
            filter: "include",
          },
        ],
      },
      {
        Header: "Actions",
        accessor: "actions",
      },
    ],
    []
  );

  // page functions

  /**
   * fetching all the products
   */
  useEffect(() => {
    setIsFetchingProducts(true);

    ProductAPI.getAll()
      .then((products) => setAllProductsFromDB(products))
      .finally(() => setIsFetchingProducts(false));
  }, []);

  /**
   * fetching all the categories
   */
  useEffect(() => {
    setIsFetchingCategories(true);

    CategoryAPI.getAll()
      .then((categories) => setAllCategoriesFromDB(categories))
      .finally(() => setIsFetchingCategories(false));
  }, []);

  /**
   * fetching all product variants
   */
  useEffect(() => {
    ProductVariantAPI.getAll().then((productVariants) =>
      setAllProductVariantsFromDB(productVariants)
    );
  }, []);

  /**
   * modify the products data to a format acceptable by the table component
   */
  const modifyProductsData = useMemo(() => {
    let productsData = [];
    allProductsFromDB?.forEach((product) => {
      productsData = [
        ...productsData,
        {
          uuid: product?.attributes?.uuid,
          name: product?.attributes?.name,
          category: product?.relationships?.category?.attributes?.name,
          form: product?.attributes?.form,
          status: product?.attributes?.active ? "active" : "inactive",
          cost:
            product?.attributes?.form === "independent"
              ? product?.attributes?.price?.cost
              : "_",
          retail:
            product?.attributes?.form === "independent"
              ? product?.attributes?.price?.retail
              : "_",
          stock: product?.attributes?.inventory?.stock,
          store: product?.attributes?.inventory?.store,
          sold: product?.attributes?.inventory?.sold,
          measure: product?.attributes?.measure,
          vat:
            product?.attributes?.form === "independent" ? (
              <Icon
                icon={
                  product?.attributes?.vat ? (
                    <BsCheck2All className="text-c_green w-5 h-5" />
                  ) : (
                    <IoIosClose className="text-red-400 w-5 h-5" />
                  )
                }
              />
            ) : (
              "_"
            ),
          product: product,
          variants:
            product?.relationships?.variants.length > 0 &&
            product?.relationships?.variants,
          actions: [
            <div className="flex gap-x-3" key={product?.attributes?.uuid}>
              <Icon
                icon={<MdDelete className="deleteActionButton " />}
                purpose={() => handleDeleteProduct(product)}
              />
              <Icon
                icon={<RiEditCircleFill className="editActionButton" />}
                purpose={() => handleEditProduct(product)}
              />
            </div>,
          ],
        },
      ];
    });

    return productsData;
  }, [allProductsFromDB]);

  /**
   * generate the subRows representing the variants of each product
   */
  const modifyProductVariantsData = useCallback((productVariants, product) => {
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
                  <BsCheck2All className="text-c_green w-5 h-5" />
                ) : (
                  <IoIosClose className="text-red-400 w-5 h-5" />
                )
              }
            />
          ),
          actions: [
            <div
              className="flex gap-x-3"
              key={productVariant?.attributes?.uuid}
            >
              <Icon
                icon={<MdDelete className="deleteActionButton" />}
                purpose={() =>
                  handleDeleteProductVariant(productVariant, product)
                }
              />
              <Icon
                icon={<RiEditCircleFill className="editActionButton" />}
                purpose={() =>
                  handleEditProductVariant(productVariant, product)
                }
              />
            </div>,
          ],
        },
      ];
    });

    return productVariantsData;
  });
  // const modifyProductVariantsData = (productVariants, product) => {

  /**
   * handle delete of a category from db
   */
  const handleDeleteCategory = (category) => {
    // display the delete confirmation modal and set the item uuid
    setGlobalCategory(category);
    setShowDeleteCategoryModal(true);
  };

  /**
   * handle delete of the product from db
   */
  const handleDeleteProduct = (product) => {
    setGlobalProduct(product);
    setShowDeleteProductModal(true);
  };

  /**
   * handle the editing of a category from db
   */
  const handleEditCategory = (category) => {
    // display the create or edit category modal and set some global states
    setGlobalCategory(category);
    setIsEditingCategory(true);
    setShowCreateOrEditCategoryModal(true);
  };

  /**
   * handle the editing of a product from the db
   */
  const handleEditProduct = (product) => {
    // display the create or edit product modal and set some global states
    setGlobalProduct(product);
    setIsEditingProduct(true);
    setShowCreateOrEditProduct(true);
  };

  /**
   * handle delete of the product variant from the db
   */
  const handleDeleteProductVariant = (variant, product) => {
    setGlobalProductVariant(variant);
    setGlobalProduct(product);
    setShowDeleteProductVariant(true);
  };

  /**
   * handle edit of the product variant from the db
   */
  const handleEditProductVariant = (variant, product) => {
    setGlobalProductVariant(variant);
    setGlobalProduct(product);
    setIsEditingProductVariant(true);
    setShowCreateOrEditProductVariantModal(true);
  };

  /**
   * Each product sub component to hold its variants
   */
  const renderRowSubComponent = React.useCallback(({ row }) => {
    return (
      <div className="my-5 px-16">
        {row.original.variants.length > 0 ? (
          <Table
            columns={productVariantsTableColumns}
            data={modifyProductVariantsData(
              row.original.variants,
              row.original.product
            )}
            showPagination={false}
            showFilters={false}
          />
        ) : (
          <div className="text-c_dark px-10  tracking-wider">
            This is an Independent Product. It has no variants.
          </div>
        )}
      </div>
    );
  }, []);

  /**
   * modify the categories data to a format acceptable by the table component
   */
  const modifyCategoriesData = () => {
    let categoriesData = [];
    allCategoriesFromDB?.forEach((category) => {
      categoriesData = [
        ...categoriesData,
        {
          uuid: category?.attributes?.uuid,
          name: category?.attributes?.name,
          description: category?.attributes?.description,
          status: category?.attributes?.active ? "active" : "inactive",
          actions: [
            <div className="flex gap-x-3" key={category?.attributes?.uuid}>
              <Icon
                icon={<MdDelete className="w-5 h-5 text-red-500" />}
                purpose={() => handleDeleteCategory(category)}
              />
              <Icon
                icon={<RiEditCircleFill className="w-5 h-5 text-c_green" />}
                purpose={() => handleEditCategory(category)}
              />
            </div>,
          ],
        },
      ];
    });

    return categoriesData;
  };

  /**
   * the pages tabs
   */
  const productPageTabs = [
    {
      label: "Categories",
      value: "categories",
      content: (
        <section>
          {/* the add category button */}
          <div>
            <Button
              title="Category"
              icon={<HiPlus className="w-5 h-5 text-c_white" />}
              buttonStyles="primaryButton"
              buttonTitleWrapperStyles="hidden sm:block"
              purpose={() => {
                setIsCreatingCategory(true);
                setShowCreateOrEditCategoryModal(true);
              }}
            />
          </div>

          {/* the table */}
          <div className="mt-5 w-full">
            {isFetchingCategories ? (
              <div className="mt-24">
                <SpinnerLoader color="fill-[#2C7A51]" />
              </div>
            ) : (
              <Table
                columns={categoriesTableColumns}
                data={modifyCategoriesData()}
                showFilters
                tableHeight="h-[350px] md:h-[380px] lg:h-[435px]"
              />
            )}
          </div>
        </section>
      ),
    },
    {
      label: "Products",
      value: "products",
      content: (
        <section>
          {/* the add product button */}
          <div className="flex flex-row gap-x-2">
            {/* the add product button */}
            <Button
              title="Product"
              icon={<HiPlus className="w-5 h-5 text-c_white" />}
              buttonStyles="primaryButton"
              buttonTitleWrapperStyles="hidden sm:block"
              purpose={() => {
                setShowCreateOrEditProduct(true);
              }}
            />

            <Button
              title="Variant"
              icon={<HiPlus className="w-5 h-5 text-c_white" />}
              buttonStyles="primaryButton"
              buttonTitleWrapperStyles="hidden sm:block"
              purpose={() => {
                setShowCreateOrEditProductVariantModal(true);
              }}
            />
          </div>

          {/* the table */}
          <div className="mt-5 w-full">
            {isFetchingProducts ? (
              <div className="mt-24">
                <SpinnerLoader color="fill-[#2C7A51]" />
              </div>
            ) : (
              <Table
                columns={productsTableColumns}
                data={modifyProductsData}
                renderRowSubComponent={renderRowSubComponent}
                showFilters
                tableHeight="h-[350px] md:h-[380px] lg:h-[435px]"
              />
            )}
          </div>
        </section>
      ),
    },
  ];

  /**
   * the official render of the page
   */
  return (
    <Tabs
      id="custom-animation"
      value="categories"
      className="h-[580px] md:h-[580px] lg:h-[630px]"
    >
      <TabsHeader>
        {productPageTabs.map(({ label, value }) => (
          <Tab key={value} value={value}>
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody
        animate={{
          mount: { y: 0 },
          unmount: { y: 250 },
        }}
      >
        {productPageTabs.map(({ value, content }) => (
          <TabPanel key={value} value={value}>
            {content}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
};

export default Product;
