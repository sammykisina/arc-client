import { useEffect } from "react";
import { useMemo, useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import { useRecoilState, useRecoilValue } from "recoil";
import { ShiftAPI } from "../api/shiftApi";
import { allEmployeesFromDBState } from "../atoms/EmployeeAtom";
import { allShiftsFromDBState } from "../atoms/ShiftAtom";
import { Icon } from "../components";
import {
  AvatarCell,
  NameUuidCell,
  NumberCell,
  StatusFilter,
  StatusPill,
  TimeCell,
} from "../components/ui-reusable-small-components/table";
import { Notification } from "../utils/notifications";

const useShift = () => {
  /**
   * Hook states
   */
  const allEmployeeFromDB = useRecoilValue(allEmployeesFromDBState);
  const [allShiftsFromDB, setAllShiftsFromDB] =
    useRecoilState(allShiftsFromDBState);
  const [isFetchingShifts, setIsFetchingShifts] = useState(false);

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
   * Hook functions
   */
  const createShift = (shiftData) => {
    ShiftAPI.create(shiftData).then((response) => {
      if (response.error === 1)
        Notification.errorNotification(response.message);
      else {
        setAllShiftsFromDB([response?.shift, ...allShiftsFromDB]);
        Notification.successNotification(response.message);
      }
    });
  };

  const getAllShiftsFromDB = () => {
    setIsFetchingShifts(true);

    ShiftAPI.getAll()
      .then((shifts) => setAllShiftsFromDB(shifts))
      .finally(() => setIsFetchingShifts(false));
  };

  const generateSelectedWaitersIds = (selectedWaiters) => {
    const waiters = new Set();

    selectedWaiters.forEach((selectedWaiter) => {
      waiters.add(selectedWaiter.value);
    });

    return [...waiters.values()];
  };

  const getShiftDataForShiftsTable = () => {
    let shiftsData = [];

    allShiftsFromDB?.forEach((shiftFromDB) => {
      shiftsData = [
        ...shiftsData,
        {
          uuid: shiftFromDB?.attributes?.uuid,
          name: shiftFromDB?.attributes?.name,
          status: shiftFromDB?.attributes?.active ? "active" : "inactive",
          total_amount: shiftFromDB?.attributes?.total_amount,
          start_time: shiftFromDB?.attributes?.duration?.start?.time,
          start_date: shiftFromDB?.attributes?.duration?.start?.date,
          end_time: shiftFromDB?.attributes?.duration?.end?.time,
          end_date: shiftFromDB?.attributes?.duration?.end?.date,
          created_by: shiftFromDB?.attributes?.created_by,
          workers: shiftFromDB?.relationships?.workers,
        },
      ];
    });

    return shiftsData;
  };

  const getShiftWorkersDataForShiftWorkersTable = (workers) => {
    let shiftWorkersData = [];

    workers?.forEach((worker) => {
      shiftWorkersData = [
        ...shiftWorkersData,
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
            <Icon
              key={worker?.attributes?.uuid}
              icon={<MdDelete className="deleteActionButton " />}
              // purpose={() => handleDelete(employee)}
            />,
          ],
        },
      ];
    });

    return shiftWorkersData;
  };

  const getBartenderOptions = useMemo(() => {
    const bartenderOptions = new Set();

    const bartenders = allEmployeeFromDB.filter(
      (employeeFromDB) =>
        employeeFromDB?.relationships?.role?.attributes?.slug === "bartender"
    );

    bartenders?.forEach((bartender) => {
      bartenderOptions.add({
        name:
          bartender?.attributes?.first_name +
          " " +
          bartender?.attributes?.last_name,
        value: bartender?.id,
      });
    });

    return [...bartenderOptions.values()];
  }, [allEmployeeFromDB]);

  const getWaitersOptions = useMemo(() => {
    const waiterOptions = new Set();

    const waiters = allEmployeeFromDB.filter(
      (employeeFromDB) =>
        employeeFromDB?.relationships?.role?.attributes?.slug === "waiter"
    );

    waiters?.forEach((waiter) => {
      waiterOptions.add({
        name:
          waiter?.attributes?.first_name + " " + waiter?.attributes?.last_name,
        value: waiter?.id,
      });
    });

    return [...waiterOptions.values()];
  }, [allEmployeeFromDB]);

  return {
    getBartenderOptions,
    getWaitersOptions,
    createShift,
    getAllShiftsFromDB,
    isFetchingShifts,
    generateSelectedWaitersIds,
    shiftsTableColumns,
    shiftWorkersColumns,
    getShiftDataForShiftsTable,
    getShiftWorkersDataForShiftWorkersTable,
  };
};

export default useShift;
