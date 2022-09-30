import React, { useEffect, useCallback, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { showCreateOrEditShiftState } from "../../atoms/ModalAtoms";
import { Button, SpinnerLoader, Table } from "../";
import { useEmployee, useShift } from "../../hooks";
import {
  allShiftsFromDBState,
  currentlyActiveShiftState,
} from "../../atoms/ShiftAtom";

const Shift = () => {
  /**
   * Component states
   */
  const setShowCreateOrEditShift = useSetRecoilState(
    showCreateOrEditShiftState
  );
  const allShiftsFromDB = useRecoilValue(allShiftsFromDBState);
  const [currentlyActiveShift, setCurrentlyActiveShift] = useRecoilState(
    currentlyActiveShiftState
  );
  const {
    shiftsTableColumns,
    shiftWorkersColumns,
    getShiftDataForShiftsTable,
    getShiftWorkersDataForShiftWorkersTable,
    getAllShiftsFromDB,
    isFetchingShifts,
  } = useShift();
  const { getAllEmployeeFromDB } = useEmployee();

  /**
   * Each shift sub component to hold its extra data
   */
  const renderRowSubComponent = useCallback(({ row }) => {
    return (
      <div className="w-[680px] px-3 pb-3">
        {isFetchingShifts ? (
          <div className="mt-24">
            <SpinnerLoader color="fill-[#2C7A51]" />
          </div>
        ) : (
          <Table
            columns={shiftWorkersColumns}
            data={getShiftWorkersDataForShiftWorkersTable(row.original.workers)}
            showPagination={false}
            showFilters={false}
          />
        )}
      </div>
    );
  }, []);

  useEffect(() => {
    Promise.all([getAllShiftsFromDB(), getAllEmployeeFromDB()]);
  }, []);

  // check if there is an active shift
  useEffect(() => {
    if (allShiftsFromDB) {
      allShiftsFromDB.forEach(
        (shiftFromDB) =>
          shiftFromDB?.attributes?.active &&
          setCurrentlyActiveShift(shiftFromDB)
      );
    }
  }, [allShiftsFromDB]);

  return (
    <section>
      {/* the create shift button */}
      <div>
        <Button
          title="Create Shift"
          icon={<HiPlus className="w-5 h-5 text-c_white" />}
          buttonStyles="primaryButton disabled:bg-c_yellow/40 disabled:cursor-not-allowed"
          buttonTitleWrapperStyles="hidden sm:block"
          purpose={() => {
            setShowCreateOrEditShift(true);
          }}
          disabled={currentlyActiveShift && true}
        />
      </div>

      {/* all created shifts table */}
      <div className="mt-5 w-full ">
        {isFetchingShifts ? (
          <div className="mt-24">
            <SpinnerLoader color="fill-[#2C7A51]" />
          </div>
        ) : (
          <Table
            columns={shiftsTableColumns}
            data={getShiftDataForShiftsTable()}
            renderRowSubComponent={renderRowSubComponent}
            showFilters
            tableHeight="h-[390px] md:h-[440px] lg:h-[500px]"
          />
        )}
      </div>
    </section>
  );
};

export default Shift;
