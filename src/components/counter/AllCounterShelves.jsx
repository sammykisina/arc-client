// react framework imports
import { useMemo } from "react";

// icon imports {react icons}

// recoil imports {recoil and atoms}

// api layer imports

// all components imports {local and packages}
import {
  NumberCell,
  TimeCell,
  NameUuidCell,
} from "../ui-reusable-small-components/table";
import { SpinnerLoader, Table } from "../";
import { useRecoilValue } from "recoil";
import { isFetchingCounterShelvesState } from "../../atoms/CounterShelveAtom";

const AllCounterShelves = ({ currentUserShifts }) => {
  const isFetchingCounterShelves = useRecoilValue(
    isFetchingCounterShelvesState
  );

  // component states
  const allCounterShelvesColumns = useMemo(
    () => [
      {
        Header: "All Your Past Shifts",
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
        Header: "Amount Made",
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

  // component functions
  /**
   * modify the current user shifts to form acceptable by the table
   */
  const modifyCurrentUserShiftsData = useMemo(() => {
    let currentUserShiftsData = [];

    currentUserShifts?.forEach((currentUserShift) => {
      currentUserShiftsData = [
        ...currentUserShiftsData,
        {
          name: currentUserShift?.relationships?.shift?.attributes?.name,
          uuid: currentUserShift?.attributes?.uuid,
          start_time:
            currentUserShift?.relationships?.shift?.attributes?.duration?.start
              ?.time,
          start_date:
            currentUserShift?.relationships?.shift?.attributes?.duration?.start
              ?.date,
          end_time:
            currentUserShift?.relationships?.shift?.attributes?.duration?.end
              ?.time,
          end_date:
            currentUserShift?.relationships?.shift?.attributes?.duration?.end
              ?.date,
          created_by:
            currentUserShift?.relationships?.shift?.attributes?.created_by,
          total_amount:
            currentUserShift?.relationships?.shift?.attributes?.total_amount,
        },
      ];
    });

    return currentUserShiftsData;
  }, []);

  return (
    <section>
      {isFetchingCounterShelves ? (
        <div className="mt-24">
          <SpinnerLoader color="fill-[#2C7A51]" />
        </div>
      ) : (
        <Table
          columns={allCounterShelvesColumns}
          data={modifyCurrentUserShiftsData}
          // renderRowSubComponent={renderRowSubComponent}
          showFilters
          tableHeight="h-[390px] md:h-[440px] lg:h-[435px]"
        />
      )}
    </section>
  );
};

export default AllCounterShelves;
