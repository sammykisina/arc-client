import React from "react";
import { useEffect } from "react";
import { useProcurement } from "../../../../hooks";
import { SpinnerLoader, Table, Button } from "../../../";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isSidebarOpenState } from "../../../../atoms/AppAtoms";
import { HiPlusSm } from "react-icons/hi";
import { showCreateOrEditProcurementModalState } from "../../../../atoms/ModalAtom";
import { useCallback } from "react";

const Procurements = () => {
  /**
   * Component states
   */
  const {
    isFetchingProcurements,
    getAllProcurementsFromDB,
    procurementTableColumns,
    getProcurementDataForProcurementTable,
    getProcurementItemDataForProcurementItemTable,
    procurementItemColumns,
  } = useProcurement();
  const isSidebarOpen = useRecoilValue(isSidebarOpenState);
  const setShowCreateOrEditProcurementModal = useSetRecoilState(
    showCreateOrEditProcurementModalState
  );

  /**
   * Component functions
   */

  const renderRowSubComponent = useCallback(({ row }) => {
    return (
      <div className="my-5 px-16">
        <Table
          columns={procurementItemColumns}
          data={getProcurementItemDataForProcurementItemTable(
            row.original.item
          )}
          showPagination={false}
        />
      </div>
    );
  }, []);

  useEffect(() => {
    getAllProcurementsFromDB();
  }, []);

  return (
    <section className="h-[440px] sm:h-[518px] lg:h-[565px]">
      <div className="mt-2 w-full">
        {isFetchingProcurements ? (
          <div className="mt-24">
            <SpinnerLoader color="fill-[#2C7A51]" />
          </div>
        ) : (
          <Table
            columns={procurementTableColumns}
            data={getProcurementDataForProcurementTable()}
            renderRowSubComponent={renderRowSubComponent}
            showFilters
            tableHeight={`h-[295px] lg:h-[505px] sm:h-[400px] md:h-[450px]lg:h-[505px]`}
          />
        )}
      </div>

      <div className="flex justify-end  absolute top-[100px] md:top-0 xl:top-[50px] right-0 w-fit">
        <Button
          title="Procurement"
          icon={<HiPlusSm className="w-5 h-5" />}
          buttonStyles="primary_button"
          buttonTitleWrapperStyles="hidden sm:block"
          purpose={() => {
            setShowCreateOrEditProcurementModal(true);
          }}
        />
      </div>
    </section>
  );
};

export default Procurements;
