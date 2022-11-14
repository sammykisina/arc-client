import { useMemo, useState } from "react";
import { BsCheck2All, BsCheck2Circle } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { RiEditCircleFill } from "react-icons/ri";
import { useRecoilState, useSetRecoilState } from "recoil";
import { TableAPI } from "../api/tableApi";
import {
  showCreateOrEditTableModalState,
  showDeleteTableModalState,
} from "../atoms/ModalAtom";
import {
  allTablesFromDBState,
  globalTableState,
  isEditingTableState,
} from "../atoms/TableAtom";
import { Icon } from "../components";
import {
  DeleteAction,
  EditAction,
  NumberCell,
} from "../components/ui-reusable-small-components/table";
import { Notification } from "../utils/notifications";

const useTable = () => {
  // hook states
  const [allTablesFromDB, setAllTablesFromDB] =
    useRecoilState(allTablesFromDBState);
  const [isFetchingTables, setIsFetchingTables] = useState(false);
  const setShowCreateOrEditTableModal = useSetRecoilState(
    showCreateOrEditTableModalState
  );
  const [globalTable, setGlobalTable] = useRecoilState(globalTableState);
  const setShowDeleteTableModal = useSetRecoilState(showDeleteTableModalState);
  const setIsEditingTable = useSetRecoilState(isEditingTableState);

  const numberOfSeatsOptions = ["2", "4", "6", "8", "10"];

  const tableNameOptions = [
    "Lots of Love",
    "Mann's Mint",
    "Brown Eyes",
    "Smell of Bakery",
    "State of Mint",
    "Aare River",
    "River Brienz",
    "Aarhusian Sky",
    "Black",
    "Abaidh White",
    "Abalone",
    "Shell",
    "Mansion",
    "Playground",
    "Spaceship",
    "Abbey",
    "Pink",
    "Road",
    "Ablaze",
    "Burn",
    "Midnight",
    "Shaft",
    "Arrowhead",
    "Deco",
    "Sera",
    "Belladonna",
    "Cream",
    "Sable",
  ];
  const tablesColumns = useMemo(
    () => [
      {
        Header: "Property Tables",
        columns: [
          {
            Header: "Name",
            accessor: "name",
          },
          {
            Header: "Number",
            accessor: "number",
          },
          {
            Header: "Seats",
            accessor: "seats",
            Cell: NumberCell,
          },
          {
            Header: "Extendable",
            accessor: "extendable",
          },
          {
            Header: "Extending Seats",
            accessor: "extending_seats",
            Cell: NumberCell,
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
  const getCurrentlyAssignedTableNames = () => {
    const tableNames = new Set();

    allTablesFromDB.forEach((tableFromDB) => {
      tableNames.add(tableFromDB.attributes?.name);
    });

    return [...tableNames.values()];
  };

  const getAllTablesFromDB = () => {
    setIsFetchingTables(true);
    TableAPI.getAll()
      .then((tables) => setAllTablesFromDB(tables))
      .finally(() => setIsFetchingTables(false));
  };

  const getTableEditData = (
    name,
    number_of_seats,
    extendable,
    number_of_extending_seats
  ) => {
    let tableEditData = {};

    if (name != globalTable?.attributes?.name)
      tableEditData = { ...tableEditData, name };

    if (number_of_seats != globalTable?.attributes?.number_of_seats)
      tableEditData = { ...tableEditData, number_of_seats };

    if (
      extendable &&
      number_of_extending_seats !=
        globalTable?.attributes?.number_of_extending_seats
    )
      tableEditData = {
        ...tableEditData,
        extendable,
        number_of_extending_seats,
      };

    if (!extendable && globalTable?.attributes?.extendable) {
      tableEditData = {
        ...tableEditData,
        extendable,
      };
    }

    return tableEditData;
  };

  const createTable = (tableData) => {
    TableAPI.create(tableData).then((response) => {
      if (response.error === 1)
        Notification.errorNotification(response.message);
      else {
        setAllTablesFromDB([response.table, ...allTablesFromDB]),
          Notification.successNotification(response.message);
      }
    });
  };

  const updateTable = (
    editTableData,
    name,
    number_of_seats,
    extendable,
    number_of_extending_seats
  ) => {
    TableAPI.update(globalTable?.attributes?.uuid, editTableData).then(
      (response) => {
        if (response.error === 1) {
          Notification.errorNotification(response.message);
        } else {
          const tableBeingEdited = allTablesFromDB.find(
            (tableFromDB) =>
              globalTable?.attributes?.uuid === tableFromDB?.attributes?.uuid
          );

          const newUpdatedTables = allTablesFromDB.map((tableFromDB) =>
            tableFromDB?.attributes?.uuid === tableBeingEdited?.attributes?.uuid
              ? {
                  ...tableBeingEdited,
                  attributes: {
                    ...tableBeingEdited?.attributes,
                    name,
                    number_of_seats,
                    extendable,
                    number_of_extending_seats,
                  },
                }
              : tableFromDB
          );

          setAllTablesFromDB(newUpdatedTables);
          Notification.successNotification(response.message);
        }

        setIsEditingTable(false);
        setGlobalTable(null);
      }
    );
  };

  const deleteTable = () => {
    TableAPI.delete(globalTable?.attributes?.uuid).then((response) => {
      if (response.error === 1)
        Notification.errorNotification(response.message);
      else {
        const newTables = allTablesFromDB.filter(
          (tableFromDB) =>
            tableFromDB?.attributes?.uuid != globalTable?.attributes?.uuid
        );

        setAllTablesFromDB(newTables);
        Notification.successNotification(response.message);
      }
    });
  };

  const getTablesDataForTablesTable = () => {
    let tablesData = [];

    allTablesFromDB?.forEach((table) => {
      tablesData = [
        ...tablesData,
        {
          uuid: table?.attributes?.uuid,
          name: table?.attributes?.name,
          seats: table?.attributes?.number_of_seats,
          number: table?.attributes?.number,
          extendable: (
            <Icon
              icon={
                table?.attributes?.extendable ? (
                  <BsCheck2Circle className="text-c_green w-4 h-4" />
                ) : (
                  <BsCheck2Circle className="text-red-400 w-4 h-4" />
                )
              }
            />
          ),
          extending_seats: table?.attributes?.number_of_extending_seats,
          actions: [
            <div className="flex gap-x-3" key={table?.attributes?.uuid}>
              <DeleteAction
                purpose={() => {
                  setGlobalTable(table);
                  setShowDeleteTableModal(true);
                }}
              />
              <EditAction
                purpose={() => {
                  setGlobalTable(table);
                  setIsEditingTable(true);
                  setShowCreateOrEditTableModal(true);
                }}
              />
            </div>,
          ],
        },
      ];
    });

    return tablesData;
  };

  return {
    numberOfSeatsOptions,
    tableNameOptions,
    getCurrentlyAssignedTableNames,
    getAllTablesFromDB,
    isFetchingTables,
    createTable,
    updateTable,
    deleteTable,
    getTablesDataForTablesTable,
    tablesColumns,
    getTableEditData,
  };
};

export default useTable;
