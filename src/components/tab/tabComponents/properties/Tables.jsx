import React, { useEffect } from "react";
import { HiPlus, HiPlusSm } from "react-icons/hi";
import { useSetRecoilState } from "recoil";
import { Button, SpinnerLoader, Table } from "../../../";
import { showCreateOrEditTableModalState } from "../../../../atoms/ModalAtom";
import { useTable } from "../../../../hooks";

const Tables = () => {
  // component states
  const setShowCreateOrEditTableModal = useSetRecoilState(
    showCreateOrEditTableModalState
  );
  const {
    getAllTablesFromDB,
    isFetchingTables,
    getTablesDataForTablesTable,
    tablesColumns,
  } = useTable();

  // component functions
  useEffect(() => {
    getAllTablesFromDB();
  }, []);

  return (
    <section className="relative border border-transparent h-[440px] sm:h-[518px] lg:h-[565px]">
      {/* Tables Table*/}
      <section className="mt-2 w-full">
        {isFetchingTables ? (
          <div className="mt-24">
            <SpinnerLoader color="fill-[#2C7A51]" />
          </div>
        ) : (
          <Table
            columns={tablesColumns}
            data={getTablesDataForTablesTable()}
            showFilters
            tableHeight="h-[360px] sm:h-[435px] md:h-[450px] lg:h-[495px]"
          />
        )}
      </section>

      {/* Create Table Button */}
      <div className="absolute top-[5px] right-0 w-fit">
        <Button
          title="Table"
          icon={<HiPlusSm className="w-5 h-5 text-c_white" />}
          buttonStyles="primary_button"
          buttonTitleWrapperStyles="hidden sm:block"
          purpose={() => {
            setShowCreateOrEditTableModal(true);
          }}
        />
      </div>
    </section>
  );
};

export default Tables;
