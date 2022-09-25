// react framework imports
import React, { useEffect, useState, useMemo } from "react";

// icon imports {react icons}
import { HiChevronDown, HiPlus } from "react-icons/hi";

// recoil imports {recoil and atoms}
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  allShiftsFromDBState,
  currentlyActiveShiftState,
} from "../../atoms/ShiftAtom";
import { showCreateOrEditShiftState } from "../../atoms/ModalAtoms";
import { allEmployeesFromDBState } from "../../atoms/EmployeeAtom";

// api layer imports
import { ShiftAPI } from "../../api/shiftApi";
import { EmployeeAPI } from "../../api/employeeAPI";

// all components imports {local and packages}
import { Button, Icon, SpinnerLoader, Table } from "../";
import {
  AvatarCell,
  NameUuidCell,
  NumberCell,
  StatusFilter,
  StatusPill,
  TimeCell,
} from "../ui-reusable-small-components/table";
import { MdDelete } from "react-icons/md";
import { RiEditCircleFill } from "react-icons/ri";

const Shift = () => {
  // component states
  const [isFetchingShifts, setIsFetchingShifts] = useState(false);
  const [allShiftsFromDB, setAllShiftsFromDB] =
    useRecoilState(allShiftsFromDBState);
  const [currentlyActiveShift, setCurrentlyActiveShift] = useRecoilState(
    currentlyActiveShiftState
  );
  const setShowCreateOrEditShift = useSetRecoilState(
    showCreateOrEditShiftState
  );
  const setAllEmployeesFromDB = useSetRecoilState(allEmployeesFromDBState);

  /**
   * shifts table columns
   */
  const shiftsTableColumns = useMemo(
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
        Header: "Shift Info",
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
        Header: "Time",
        columns: [
          {
            Header: "Start",
            accessor: "start_date",
            Cell: TimeCell,
            timeAccessor: "start_time",
          },
          {
            Header: "End",
            accessor: "end_date",
            Cell: TimeCell,
            timeAccessor: "end_time",
          },
        ],
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: StatusPill,
        Filter: StatusFilter,
        filter: "include",
      },
      {
        Header: "Amount",
        accessor: "total_amount",
        Cell: NumberCell,
      },
      {
        Header: "Created By",
        accessor: "created_by",
      },
    ],
    []
  );

  /**
   * shift workers columns
   */
  const shiftWorkersColumns = useMemo(
    () => [
      {
        Header: "Shift Workers",
        columns: [
          {
            Header: "Name",
            accessor: "name",
            Cell: AvatarCell,
            emailAccessor: "email",
          },
          {
            Header: "Title",
            accessor: "title",
          },
          {
            Header: "Role",
            accessor: "role",
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
   * modify the shifts data to a format acceptable by the table component
   */
  const modifyShiftsData = () => {
    let shiftsData = [];
    allShiftsFromDB?.forEach((shift) => {
      // shift data
      shiftsData = [
        ...shiftsData,
        {
          uuid: shift?.attributes?.uuid,
          name: shift?.attributes?.name,
          status: shift?.attributes?.active ? "active" : "inactive",
          total_amount: shift?.attributes?.total_amount,
          start_time: shift?.attributes?.duration?.start?.time,
          start_date: shift?.attributes?.duration?.start?.date,
          end_time: shift?.attributes?.duration?.end?.time,
          end_date: shift?.attributes?.duration?.end?.date,
          created_by: shift?.attributes?.created_by,
          workers: shift?.relationships?.workers,
        },
      ];
    });

    return shiftsData;
  };

  /**
   * modify the shift works data to a format acceptable by the table component
   */
  const modifyShiftWorkersData = (workers) => {
    let shiftWorkers = [];

    workers?.forEach((worker) => {
      shiftWorkers = [
        ...shiftWorkers,
        {
          uuid: worker?.attributes?.uuid,
          name:
            worker?.attributes?.first_name +
            " " +
            worker?.attributes?.last_name,
          email: worker?.attributes?.email,
          title: "Employee",
          role: worker?.relationships?.role?.attributes.name,
          actions: [
            <div className="flex gap-x-3" key={worker?.attributes?.uuid}>
              <Icon
                icon={<MdDelete className="deleteActionButton " />}
                // purpose={() => handleDelete(employee)}
              />
              <Icon
                icon={<RiEditCircleFill className="editActionButton" />}
                // purpose={() => handleEdit(employee)}
              />
            </div>,
          ],
        },
      ];
    });

    return shiftWorkers;
  };

  /**
   * Each shift sub component to hold its workers
   */
  const renderRowSubComponent = React.useCallback(({ row }) => {
    return (
      <div className="w-[680px] px-3 pb-3">
        {isFetchingShifts ? (
          <div className="mt-24">
            <SpinnerLoader color="fill-[#2C7A51]" />
          </div>
        ) : (
          <Table
            columns={shiftWorkersColumns}
            data={modifyShiftWorkersData(row.original.workers)}
            showPagination={false}
            showFilters={false}
          />
        )}
      </div>
    );
  }, []);

  // component functions
  /**
   * fetch all available shifts
   */
  useEffect(() => {
    setIsFetchingShifts(true);

    // fetch
    ShiftAPI.getAll()
      .then((shifts) => setAllShiftsFromDB(shifts))
      .finally(() => setIsFetchingShifts(false));
  }, []);

  /**
   * fetch all available employees
   */
  useEffect(() => {
    EmployeeAPI.getAll().then((employees) => {
      setAllEmployeesFromDB(employees);
    });
  }, []);

  // set the currently active shift
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
          // <Table columns={shiftsTableColumns} data={modifyShiftsData()} />
          <Table
            columns={shiftsTableColumns}
            data={modifyShiftsData()}
            renderRowSubComponent={renderRowSubComponent}
            showFilters
            tableHeight="h-[390px] md:h-[440px] lg:h-[435px]"
          />
        )}
      </div>
    </section>
  );
};

export default Shift;
