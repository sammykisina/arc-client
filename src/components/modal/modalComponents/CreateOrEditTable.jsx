import React, { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  globalTableState,
  isEditingTableState,
} from "../../../atoms/TableAtom";
import { Button, CheckBox, Line, Select, Title } from "../../";
import { useForm } from "react-hook-form";
import ctr from "@netlify/classnames-template-literals";
import { useState } from "react";
import { BsSave } from "react-icons/bs";
import { useTable } from "../../../hooks";
import { Notification } from "../../../utils/notifications";
import { showCreateOrEditTableModalState } from "../../../atoms/ModalAtoms";

const CreateOrEditTable = () => {
  /**
   * Component states
   */
  const [isEditingTable, setIsEditingTable] =
    useRecoilState(isEditingTableState);
  const { handleSubmit } = useForm();
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
    {
      name: "name",
      label: "Select Name",
      options: tableNameOptions,
      errorMessage: "Select name",
      component: "Select",
      type: "select",
      selected: selectedTableName,
      setSelected: setSelectedTableName,
    },
    {
      name: "number_of_seats",
      label: "Select Number of Seats",
      options: numberOfSeatsOptions,
      errorMessage: "Select number of seats",
      component: "Select",
      type: "select",
      selected: selectedNumberOfSeats,
      setSelected: setSelectedNumberOfSeats,
    },
    {
      component: "Switch",
      type: "radio",
      label: "Extendable?",
    },
    {
      name: "number_of_extending_seats",
      label: "Select Extending Seats",
      options: numberOfSeatsOptions,
      errorMessage: "Select number of extending seats",
      component: "Select",
      type: "select",
      selected: selectedNumberOfExtendingSeats,
      setSelected: setSelectedNumberOfExtendingSeats,
      extraStyles: extendable ? "block" : "hidden",
    },
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
                number_of_seats: selectedNumberOfSeats,
                extendable: extendable,
                number_of_extending_seats:
                  extendable && selectedNumberOfExtendingSeats,
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
    <section className="relative h-full">
      <Title title={isEditingTable ? "Edit Table" : "Create Table"} />
      <Line lineStyles="bg-c_yellow/100 w-[25px] h-[5px] rounded-full" />

      {/* fields */}
      <div className="sm:flex justify-center items-center">
        <form className={formStyles} onSubmit={handleSubmit(onSubmit)}>
          {tableInputs.map((tableInput, tableInputIndex) => (
            <div
              key={tableInputIndex}
              className={`h-fit ${tableInputs.gap && "mt-5 sm:mt-0 "}`}
            >
              {tableInput.component === "Select" ? (
                <div
                  className={`input-group w-[250px] sm:w-[220px] md:w-[240px] ${tableInput.extraStyles} `}
                >
                  <div className="input">
                    <Select
                      title="-"
                      options={tableInput.options}
                      selected={tableInput.selected}
                      setSelected={tableInput.setSelected}
                    />
                  </div>

                  <label className="placeholder">{tableInput.label}</label>
                </div>
              ) : (
                <div
                  className={`mt-1 ml-2 sm:ml-4 w-[250px] sm:w-[200px] md:w-[240px]`}
                >
                  <CheckBox
                    label={tableInput.label}
                    checkLabelStyles="text-c_dark/50 text-base"
                    checkIconsWrapper="bg-c_green_light rounded-full p-1"
                    checkIconStyles="text-c_green"
                    isChecked={extendable}
                    setIsChecked={setExtendable}
                  />
                </div>
              )}
            </div>
          ))}

          <div className={btnWrapper}>
            <Button
              title="Save"
              icon={<BsSave className="w-5 h-5 text-white" />}
              buttonStyles="flex items-center gap-x-2 px-4 py-2 bg-c_yellow rounded-xl text-white"
              buttonTitleWrapperStyles="hidden sm:block"
              type="submit"
            />
          </div>
        </form>
      </div>
    </section>
  );
};

// styles
const formStyles = ctr(`
  sm:grid 
  grid-cols-2 
  overflow-auto 
  scrollbar-hide 
  flex 
  flex-col 
  gap-y-3
  items-center
  duration-300 
  h-[300px]
  w-full
  sm:h-[220px]
  pt-5
  pl-1
`);

const btnWrapper = ctr(`
  mt-[30px] 
  sm:mt-10 
  px-3 
  sm:pr-9 
  flex 
  justify-end  
  absolute 
  -bottom-[0px] 
  sm:bottom-0 
  w-fit 
  right-0
`);

export default CreateOrEditTable;
