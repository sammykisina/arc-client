import React, { useEffect } from "react";
import { HiPlus } from "react-icons/hi";
import { useSetRecoilState } from "recoil";
import { showCreateOrEditTableModalState } from "../../atoms/ModalAtoms";
import { Button, SpinnerLoader, Table } from "../";
import { useTable } from "../../hooks";

const Tables = () => {
  // component states
  const setShowCreateOrEditTableModal = useSetRecoilState(
    showCreateOrEditTableModalState
  );
  const { getAllTables, isFetchingTables, getTablesData, tablesColumns } =
    useTable();

  // component functions
  useEffect(() => {
    getAllTables();
  }, []);

  return (
    <section>
      {/* the create new table button */}
      <div>
        <Button
          title="Table"
          icon={<HiPlus className="w-5 h-5 text-c_white" />}
          buttonStyles="primaryButton"
          buttonTitleWrapperStyles="hidden sm:block"
          purpose={() => {
            setShowCreateOrEditTableModal(true);
          }}
        />
      </div>

      {/* all tables data */}
      <div className="mt-5 w-full">
        {isFetchingTables ? (
          <div className="mt-24">
            <SpinnerLoader color="fill-[#2C7A51]" />
          </div>
        ) : (
          <Table
            columns={tablesColumns}
            data={getTablesData()}
            showFilters
            tableHeight="h-[350px] md:h-[380px] lg:h-[435px]"
          />
        )}
      </div>
    </section>
  );
};

export default Tables;
