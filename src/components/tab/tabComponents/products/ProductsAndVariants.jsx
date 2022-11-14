import { useEffect, useCallback } from "react";
import { HiPlus, HiPlusSm } from "react-icons/hi";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Button, SpinnerLoader, Table } from "../../../";
import { isSidebarOpenState } from "../../../../atoms/AppAtoms";
import {
  showCreateOrEditProductState,
  showCreateOrEditProductVariantModalState,
} from "../../../../atoms/ModalAtom";
import { useProduct, useProductVariant } from "../../../../hooks";

const ProductsAndVariants = () => {
  /**
   * Component states
   */
  const setShowCreateOrEditProduct = useSetRecoilState(
    showCreateOrEditProductState
  );
  const setShowCreateOrEditProductVariantModal = useSetRecoilState(
    showCreateOrEditProductVariantModalState
  );
  const isSidebarOpen = useRecoilValue(isSidebarOpenState);

  const {
    productVariantsTableColumns,
    getAllProductVariantsFromDB,
    getProductVariantsDataForProductVariantsTable,
  } = useProductVariant();

  const {
    getAllProductsFromDB,
    isFetchingProducts,
    productsTableColumns,
    getProductsDataForProductsTable,
  } = useProduct();

  /**
   * Component functions
   */
  useEffect(() => {
    Promise.all([getAllProductsFromDB(), getAllProductVariantsFromDB()]);
  }, []);

  /**
   * Each product sub component to hold its variants
   */
  const renderRowSubComponent = useCallback(({ row }) => {
    return (
      <div className="my-5 px-16">
        {row.original.product?.attributes?.form === "dependent" ? (
          row.original.variants.length > 0 ? (
            <Table
              columns={productVariantsTableColumns}
              data={getProductVariantsDataForProductVariantsTable(
                row.original.variants,
                row.original.product
              )}
              showPagination={false}
              showFilters
            />
          ) : (
            <div className="text-c_dark px-10 text-sm  tracking-wider">
              Product Variants Not Created Yet.
            </div>
          )
        ) : (
          <div className="text-c_dark px-10 text-sm tracking-wider">
            This is an Independent Product. It has no variants.
          </div>
        )}
      </div>
    );
  }, []);

  return (
    <section className="h-[440px] sm:h-[520px] lg:h-[565px] relative">
      {/* the table */}
      <div className="mt-2 w-full">
        {isFetchingProducts ? (
          <div className="mt-24">
            <SpinnerLoader color="fill-[#2C7A51]" />
          </div>
        ) : (
          <Table
            columns={productsTableColumns}
            data={getProductsDataForProductsTable()}
            renderRowSubComponent={renderRowSubComponent}
            showFilters
            tableHeight={`h-[245px] ${
              isSidebarOpen
                ? "sm:h-[325px] md:h-[377px] lg:h-[453px] "
                : " sm:h-[360px] md:h-[406px] lg:h-[453px]"
            }`}
          />
        )}
      </div>

      {/* Add Product And Variant Btns */}
      <div className="flex flex-row gap-x-2 justify-end w-full absolute bottom-0">
        <Button
          title="Product"
          icon={<HiPlusSm className="w-5 h-5" />}
          buttonStyles="primary_button"
          purpose={() => {
            setShowCreateOrEditProduct(true);
          }}
        />

        <Button
          title="Variant"
          icon={<HiPlusSm className="w-5 h-5 " />}
          buttonStyles="primary_button"
          purpose={() => {
            setShowCreateOrEditProductVariantModal(true);
          }}
        />
      </div>
    </section>
  );
};

export default ProductsAndVariants;
