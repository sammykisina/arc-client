import { useCallback } from "react";
import useSuppliersList from "../../../../hooks/useSuppliersList";
import { Button, SpinnerLoader, Table } from "../../../";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isSidebarOpenState } from "../../../../atoms/AppAtoms";
import { HiPlus } from "react-icons/hi";
import { showCreateOrEditSupplierModalState } from "../../../../atoms/ModalAtoms";

const SuppliersList = () => {
  /**
   * Component states
   */
  const isSidebarOpen = useRecoilValue(isSidebarOpenState);
  const setShowCreateOrEditSupplierModal = useSetRecoilState(
    showCreateOrEditSupplierModalState
  );
  const {
    suppliersListTableColumn,
    isFetchingSuppliers,
    getSuppliersDataForSuppliersListTable,
    getSupplierSuppliedProductsDataForSuppliedProductsTable,
    getSupplierSuppliedVariantsDataForSuppliedVariantTable,
    supplierSuppliedProductsColumn,
    supplierSuppliedVariantsColumn,
  } = useSuppliersList();

  /**
   * Each supplier sub component to hold extra data
   */
  const renderRowSubComponent = useCallback(({ row }) => {
    return (
      <div className="my-5 px-16 flex flex-col gap-4 w-fit">
        {row.original?.products?.length > 0 ? (
          <Table
            columns={supplierSuppliedProductsColumn}
            data={getSupplierSuppliedProductsDataForSuppliedProductsTable(
              row.original.products,
              row.original?.id
            )}
            showPagination={false}
            showFilters
          />
        ) : (
          <div className="text-c_dark px-10 text-sm  tracking-wider border py-4 ">
            Not Yet been Assigned Any Supplied Products Yet.
          </div>
        )}

        {row.original?.variants?.length > 0 ? (
          <Table
            columns={supplierSuppliedVariantsColumn}
            data={getSupplierSuppliedVariantsDataForSuppliedVariantTable(
              row.original.variants,
              row.original?.id
            )}
            showPagination={false}
            showFilters
          />
        ) : (
          <div className="text-c_dark px-10 text-sm  tracking-wider border py-4 ">
            Not Yet been Assigned Any Supplied Variants Yet.
          </div>
        )}
      </div>
    );
  }, []);

  return (
    <section className="h-[440px] sm:h-[518px] lg:h-[565px]">
      <div className="mt-2 w-full">
        {isFetchingSuppliers ? (
          <div className="mt-24">
            <SpinnerLoader color="fill-[#2C7A51]" />
          </div>
        ) : (
          <Table
            columns={suppliersListTableColumn}
            data={getSuppliersDataForSuppliersListTable()}
            renderRowSubComponent={renderRowSubComponent}
            showFilters
            tableHeight={`h-[295px] ${
              isSidebarOpen
                ? "sm:h-[360px] md:h-[430px] lg:h-[500px]"
                : "sm:h-[395px] md:h-[460px] lg:h-[500px]"
            }`}
          />
        )}
      </div>

      <div className="flex justify-end  absolute top-[100px] md:top-0 xl:top-[50px] right-0 w-fit">
        <Button
          title="Supplier"
          icon={<HiPlus className="w-5 h-5 text-c_white" />}
          buttonStyles="primaryButton"
          buttonTitleWrapperStyles="hidden sm:block"
          purpose={() => {
            setShowCreateOrEditSupplierModal(true);
          }}
        />
      </div>
    </section>
  );
};

export default SuppliersList;
