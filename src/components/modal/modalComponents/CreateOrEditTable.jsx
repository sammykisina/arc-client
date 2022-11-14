import React, { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  globalTableState,
  isEditingTableState,
} from "../../../atoms/TableAtom";
import { Button, CheckBox, Line, ModalHeader, Select, Title } from "../../";
import { useState } from "react";
import { useTable } from "../../../hooks";
import { Notification } from "../../../utils/notifications";
import { showCreateOrEditTableModalState } from "../../../atoms/ModalAtom";
import { BsSave } from "react-icons/bs";

const CreateOrEditTable = () => {
  /**
   * Component states
   */
  const [isEditingTable, setIsEditingTable] =
    useRecoilState(isEditingTableState);
  const [selectedTableName, setSelectedTableName] = useState("");
  const [selectedNumberOfSeats, setSelectedNumberOfSeats] = useState("");
  const [selectedNumberOfExtendingSeats, setSelectedNumberOfExtendingSeats] =
    useState("");
  const [extendable, setExtendable] = useState(false);
  const [globalTable, setGlobalTable] = useRecoilState(globalTableState);
  const setShowCreateOrEditTableModel = useSetRecoilState(
    showCreateOrEditTableModalState
  );
  const {
    numberOfSeatsOptions,
    tableNameOptions,
    getCurrentlyAssignedTableNames,
    createTable,
    getTableEditData,
    updateTable,
  } = useTable();

  const tableInputs = [
    [
      {
        name: "name",
        label: "Select Name",
        options: tableNameOptions,
        component: "Select",
        type: "select",
        selected: selectedTableName,
        setSelected: setSelectedTableName,
      },
      {
        name: "number_of_seats",
        label: "Number of Seats",
        options: numberOfSeatsOptions,
        component: "Select",
        type: "select",
        selected: selectedNumberOfSeats,
        setSelected: setSelectedNumberOfSeats,
      },
    ],
    [
      {
        component: "Switch",
        type: "radio",
        label: "Extendable?",
        isChecked: extendable,
        setIsChecked: setExtendable,
      },
      {
        name: "number_of_extending_seats",
        label: "Extending Seats",
        options: numberOfSeatsOptions,
        component: "Select",
        type: "select",
        selected: selectedNumberOfExtendingSeats,
        setSelected: setSelectedNumberOfExtendingSeats,
        extraStyles: extendable ? "block" : "hidden",
      },
    ],
  ];
  // component functions
  const onSubmit = () => {
    if (selectedTableName === undefined)
      return Notification.errorNotification("Select the table name.");

    if (selectedNumberOfSeats === undefined)
      return Notification.errorNotification(
        "Select the table's number of seats."
      );

    if (extendable && selectedNumberOfExtendingSeats === undefined)
      return Notification.errorNotification(
        "Select the extending number of seats."
      );

    // validate if the chosen name has been taken by another table
    if (
      !isEditingTable &&
      getCurrentlyAssignedTableNames().includes(selectedTableName)
    ) {
      Notification.errorNotification(
        "The selected table name has been assigned to another table."
      );

      return;
    }

    // when editing
    let tableEditData = {};
    if (isEditingTable) {
      tableEditData = getTableEditData(
        selectedTableName,
        selectedNumberOfSeats,
        extendable,
        selectedNumberOfExtendingSeats
      );

      if (Object.keys(tableEditData).length === 0) {
        setGlobalTable(null),
          setIsEditingTable(false),
          Notification.errorNotification("Nothing to edit"),
          setShowCreateOrEditTableModel(false);

        return;
      }
    }

    //  actual creating or editing of the table
    isEditingTable
      ? updateTable(
          tableEditData,
          selectedTableName,
          selectedNumberOfSeats,
          extendable,
          extendable ? selectedNumberOfExtendingSeats : 0
        )
      : createTable(
          extendable
            ? {
                name: selectedTableName,
                number_of_seats: parseInt(selectedNumberOfSeats),
                extendable: extendable,
                number_of_extending_seats:
                  extendable && parseInt(selectedNumberOfExtendingSeats),
              }
            : {
                name: selectedTableName,
                number_of_seats: selectedNumberOfSeats,
                extendable: extendable,
              }
        );
    setShowCreateOrEditTableModel(false);
  };

  // set the form with initial values when editing
  useEffect(() => {
    setSelectedTableName(globalTable?.attributes?.name);
    setSelectedNumberOfSeats(globalTable?.attributes?.number_of_seats);

    setExtendable(globalTable?.attributes?.extendable);
    globalTable?.attributes?.extendable &&
      setSelectedNumberOfExtendingSeats(
        globalTable?.attributes?.number_of_extending_seats
      );
  }, [globalTable]);

  return (
    <section className="duration-300 h-full flex flex-col justify-between">
      <div className="space-y-5">
        {/* Header */}
        <ModalHeader
          close={() => {
            setGlobalTable(null),
              setIsEditingTable(false),
              setShowCreateOrEditTableModel(false);
          }}
          isEditing={isEditingTable}
          editTitle="Editing Table"
          createTitle="Creating a Table"
        />

        <div>
          {/* Body */}
          <section className="px-4 space-y-5 sm:space-y-0 gap-x-3 sm:grid grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-c_yellow">
            {/* Table Info Section */}
            <section className="space-y-4 col-span-3">
              <Title title="Table Info." />

              <div className="space-y-5">
                {tableInputs[0].map((tableInput, tableInputIndex) => (
                  <Select
                    key={tableInputIndex}
                    title=""
                    options={tableInput.options}
                    selectWrapperStyles={`w-full rounded-md ring-c_gray  py-2 px-2`}
                    selectPanelStyles="ring-c_gray/40 shadow h-[90px]"
                    selected={tableInput.selected}
                    setSelected={(option) => tableInput.setSelected(option)}
                    selectLabel={tableInput.label}
                    selectLabelStyles="border text-c_dark/50 rounded-full px-1"
                  />
                ))}
              </div>
            </section>

            {/* Extending Table Decision Section */}
            <section className="space-y-2 col-span-2 py-2 sm:py-0 sm:px-2">
              <Title title="Extending Info." />

              <div className="space-y-5">
                {tableInputs[1].map((tableInput, tableInputIndex) =>
                  tableInput.component === "Switch" ? (
                    <CheckBox
                      key={tableInputIndex}
                      label={tableInput.label}
                      checkLabelStyles="text-c_dark"
                      checkIconStyles="text-c_yellow"
                      isChecked={tableInput.isChecked}
                      setIsChecked={tableInput.setIsChecked}
                    />
                  ) : (
                    <Select
                      key={tableInputIndex}
                      title=""
                      options={tableInput.options}
                      selectWrapperStyles={`w-full rounded-md ring-c_gray  py-2 px-2 ${
                        extendable ? "block" : "hidden"
                      }`}
                      selectPanelStyles="ring-c_gray/40 shadow h-[90px]"
                      selected={tableInput.selected}
                      setSelected={(option) => tableInput.setSelected(option)}
                      selectLabel={tableInput.label}
                      selectLabelStyles="border text-c_dark/50 rounded-full px-1"
                    />
                  )
                )}
              </div>
            </section>
          </section>
        </div>
      </div>

      {/* Create Btn */}
      <div className="px-4 py-2 flex justify-end">
        <Button
          title="Save"
          icon={<BsSave className="w-5 h-5" />}
          buttonStyles="primary_button"
          purpose={onSubmit}
        />
      </div>
    </section>
  );
};

export default CreateOrEditTable;
