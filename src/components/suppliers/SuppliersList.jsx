import { useCallback, useEffect } from "react";
import useSuppliersList from "../../hooks/useSuppliersList";
import { Button, SpinnerLoader, Table } from "../";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isSidebarOpenState } from "../../atoms/AppAtoms";
import { HiPlus } from "react-icons/hi";
import { showCreateOrEditSupplierModalState } from "../../atoms/ModalAtoms";

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
    getAllSuppliersFromDB,
    isFetchingSuppliers,
    getSuppliersDataForSuppliersListTable,
  } = useSuppliersList();

  /**
   * Component functions
   */
  useEffect(() => {
    getAllSuppliersFromDB();
  }, []);

  /**
   * Each supplier sub component to hold extra data
   */
  const renderRowSubComponent = useCallback(({ row }) => {
    return (
      <div className="h-[500px] w-[300px] p-2">
        <div className="w-full h-full border "></div>
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

      <div className="flex justify-end  absolute top-0 right-0 w-fit">
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
