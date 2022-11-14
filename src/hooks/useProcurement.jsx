import { useState, useMemo } from "react";
import { HiChevronDown } from "react-icons/hi";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ProcurementAPI } from "../api/procurementApi";
import {
  showCreateOrEditProcurementModalState,
  showDeleteProcurementModalState,
} from "../atoms/ModalAtom";
import {
  allProcurementsFromDBState,
  globalProcurementState,
  isEditingProcurementState,
} from "../atoms/ProcurementAtom";
import { Icon } from "../components";
import {
  Date,
  DeleteAction,
  EditAction,
  NumberCell,
  StatusFilter,
  StatusPill,
} from "../components/ui-reusable-small-components/table";
import { formatDate } from "../utils/app";
import { Notification } from "../utils/notifications";

const useProcurement = () => {
  /**
   * Hook states
   */
  const [isFetchingProcurements, setIsFetchingProcurements] = useState(false);
  const [allProcurementsFromDB, setAllProcurementsFromDB] = useRecoilState(
    allProcurementsFromDBState
  );
  const [globalProcurement, setGlobalProcurement] = useRecoilState(
    globalProcurementState
  );
  const setIsEditingProcurement = useSetRecoilState(isEditingProcurementState);
  const setShowCreateOrEditProcurementModal = useSetRecoilState(
    showCreateOrEditProcurementModalState
  );
  const setShowDeleteProcurementModal = useSetRecoilState(
    showDeleteProcurementModalState
  );

  // console.log("allProcurementsFromDB", allProcurementsFromDB);

  const procurementTableColumns = useMemo(
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
        Header: "Procurements",
        columns: [
          { Header: "Number", accessor: "number" },
          { Header: "Total Cost", accessor: "total_cost" },
          {
            Header: "Status",
            accessor: "status",
            Cell: StatusPill,
            Filter: StatusFilter,
            filter: "include",
          },
          {
            Header: "Procurement Date",
            accessor: "procurement_date",
            Cell: Date,
          },
          {
            Header: "Due Date",
            accessor: "due_date",
            Cell: Date,
          },
          {
            Header: "Delivered Date",
            accessor: "delivered_date",
          },
          {
            Header: "Supplier",
            accessor: "supplier",
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

  const procurementItemColumns = useMemo(
    () => [
      {
        Header: "Procurement Item",
        columns: [
          {
            Header: "Name",
            accessor: "name",
          },
          {
            Header: "Form",
            accessor: "form",
          },
          {
            Header: "Form Quantity",
            accessor: "form_quantity",
          },
          {
            Header: "Number of Pieces",
            accessor: "number_of_pieces",
          },
          {
            Header: "Measure",
            accessor: "measure",
            Cell: NumberCell,
          },
        ],
      },
    ],
    []
  );

  /**
   * Hook functions
   */
  const getAllProcurementsFromDB = () => {
    setIsFetchingProcurements(true);
    ProcurementAPI.getAll()
      .then((procurements) => setAllProcurementsFromDB(procurements))
      .finally(() => setIsFetchingProcurements(false));
  };

  const createProcurement = (procurementData) => {
    ProcurementAPI.create(procurementData).then((response) => {
      if (response.error === 1)
        Notification.errorNotification(response.message);
      else {
        setAllProcurementsFromDB([
          response.procurement,
          ...allProcurementsFromDB,
        ]);
      }
    });
  };

  const updateProcurement = (procurementEditData) => {
    ProcurementAPI.update(
      globalProcurement?.attributes?.uuid,
      procurementEditData
    ).then((response) => {
      if (response.error === 1) {
        Notification.errorNotification(response.message);
      } else {
        const procurementBeingEdited = allProcurementsFromDB.find(
          (procurementFromDB) =>
            globalProcurement?.attributes?.uuid ===
            procurementFromDB?.attributes?.uuid
        );

        procurementEditData.status === "cancelled"
          ? setAllProcurementsFromDB(
              allProcurementsFromDB?.map((procurementFromDB) =>
                procurementFromDB?.attributes?.uuid ===
                procurementBeingEdited?.attributes?.uuid
                  ? {
                      ...procurementBeingEdited,
                      attributes: {
                        ...procurementBeingEdited?.attributes,
                        status: "cancelled",
                      },
                    }
                  : procurementFromDB
              )
            )
          : globalProcurement?.relationships?.item?.attributes?.form ===
            "singles"
          ? setAllProcurementsFromDB(
              allProcurementsFromDB?.map((procurementFromDB) =>
                procurementFromDB?.attributes?.uuid ===
                procurementBeingEdited?.attributes?.uuid
                  ? {
                      ...procurementBeingEdited,
                      attributes: {
                        ...procurementBeingEdited?.attributes,
                        total_amount: procurementEditData.total_amount,
                        status: "delivered",
                        dates: {
                          ...procurementBeingEdited?.attributes?.dates,
                          delivered_date: formatDate(
                            procurementEditData.delivered_date
                          ),
                        },
                      },
                    }
                  : procurementFromDB
              )
            )
          : setAllProcurementsFromDB(
              allProcurementsFromDB?.map((procurementFromDB) =>
                procurementFromDB?.attributes?.uuid ===
                procurementBeingEdited?.attributes?.uuid
                  ? {
                      ...procurementBeingEdited,
                      attributes: {
                        ...procurementBeingEdited?.attributes,
                        total_amount: procurementEditData.total_amount,
                        status: "delivered",
                        dates: {
                          ...procurementBeingEdited?.attributes?.dates,
                          delivered_date: formatDate(
                            procurementEditData.delivered_date
                          ),
                        },
                      },
                    }
                  : procurementFromDB
              )
            );

        Notification.successNotification(response.message);
      }

      setIsEditingProcurement(false);
      setGlobalProcurement(null);
    });
  };

  const deleteProcurement = () => {
    ProcurementAPI.delete(globalProcurement?.attributes?.uuid).then(
      (response) => {
        if (response.error === 1)
          Notification.errorNotification(response.message);
        else {
          const newProcurements = allProcurementsFromDB.filter(
            (procurementFromDB) =>
              procurementFromDB?.attributes?.uuid !=
              globalProcurement?.attributes?.uuid
          );

          setAllProcurementsFromDB(newProcurements);
          Notification.successNotification(response.message);
        }
      }
    );
  };

  const getProcurementDataForProcurementTable = () => {
    let procurementData = [];

    allProcurementsFromDB?.forEach((procurementFromDB) => {
      procurementData = [
        ...procurementData,
        {
          number: procurementFromDB?.attributes?.number,
          total_cost: procurementFromDB?.attributes?.total_cost,
          status: procurementFromDB?.attributes?.status,
          due_date: procurementFromDB?.attributes?.dates?.due_date,
          procurement_date:
            procurementFromDB?.attributes?.dates?.procurement_date,
          delivered_date: procurementFromDB?.attributes?.dates?.delivered_date,
          supplier:
            procurementFromDB?.relationships?.supplier?.attributes?.name,
          actions: [
            <div
              className="flex gap-x-3 items-center"
              key={procurementFromDB?.attributes?.uuid}
            >
              <DeleteAction
                purpose={() => {
                  setGlobalProcurement(procurementFromDB),
                    setShowDeleteProcurementModal(true);
                }}
              />
              <EditAction
                purpose={() => {
                  setGlobalProcurement(procurementFromDB),
                    setIsEditingProcurement(true),
                    setShowCreateOrEditProcurementModal(true);
                }}
                iconWrapperStyles={`${
                  procurementFromDB?.attributes?.status != "pending"
                    ? "hidden"
                    : "block"
                }`}
              />
            </div>,
          ],
          item: procurementFromDB?.relationships?.item,
        },
      ];
    });

    return procurementData;
  };

  const getProcurementItemDataForProcurementItemTable = (procurementItem) => {
    return [
      {
        name: procurementItem?.attributes?.name,
        form: procurementItem?.attributes?.form,
        form_quantity:
          procurementItem?.attributes?.form === "singles"
            ? "_"
            : procurementItem?.attributes?.form_quantity,
        number_of_pieces:
          procurementItem?.attributes?.form === "singles"
            ? procurementItem?.attributes?.number_of_single_pieces
            : procurementItem?.attributes?.number_of_pieces_in_form,
        measure: procurementItem?.attributes?.measure,
      },
    ];
  };

  return {
    isFetchingProcurements,
    getAllProcurementsFromDB,
    createProcurement,
    updateProcurement,
    deleteProcurement,
    procurementTableColumns,
    getProcurementDataForProcurementTable,
    procurementItemColumns,
    getProcurementItemDataForProcurementItemTable,
  };
};

export default useProcurement;
