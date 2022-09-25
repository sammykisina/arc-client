// react framework imports
import { useState, useEffect, useMemo } from "react";

// icon imports {react icons}
import { BsSave } from "react-icons/bs";

// recoil imports {recoil and atoms}
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  allShiftsFromDBState,
  isEditingShiftState,
} from "../../../atoms/ShiftAtom";
import { currentUserRoleState } from "../../../atoms/AppAtoms";
import { showCreateOrEditShiftState } from "../../../atoms/ModalAtoms";
import { allEmployeesFromDBState } from "../../../atoms/EmployeeAtom";

// api layer imports
import { ShiftAPI } from "../../../api/shiftApi";

// all components imports {local and packages}
import { Title, Select, Line, Button, MultiSelect } from "../../";
import ctr from "@netlify/classnames-template-literals";
import { Notification } from "../../../utils/notifications";
import { getWaiters } from "../../../utils/shift";

const CreateOrEditShift = () => {
  // component states
  const [isEditingShift, setIsEditingShift] =
    useRecoilState(isEditingShiftState);
  const [selectedBartender, setSelectedBartender] = useState("");
  const [selectedWaiters, setSelectedWaiters] = useState([]);
  const allEmployeeFromDB = useRecoilValue(allEmployeesFromDBState);
  const [bartenders, setBartenders] = useState([]);
  const [waiters, setWaiters] = useState([]);
  const currentUserRole = useRecoilValue(currentUserRoleState);
  const [allShiftsFromDB, setAllShiftsFromDB] =
    useRecoilState(allShiftsFromDBState);
  const setShowCreateOrEditShift = useSetRecoilState(
    showCreateOrEditShiftState
  );
  const [bartendersOptions, setBartendersOptions] = useState([]);
  const [waitersOptions, setWaitersOptions] = useState([]);

  // component functions

  /**
   * generate shifts bartenders
   */
  useMemo(() => {
    const options = new Set();

    bartenders?.forEach((bartender) => {
      options.add({
        name:
          bartender?.attributes?.first_name +
          " " +
          bartender?.attributes?.last_name,
        value: bartender?.id,
      });
    });

    setBartendersOptions([...options.values()]);
    return [...options.values()];
  }, [bartenders]);

  /**
   * generate shifts waiters
   */
  useMemo(() => {
    const options = new Set();

    waiters?.forEach((bartender) => {
      options.add({
        name:
          bartender?.attributes?.first_name +
          " " +
          bartender?.attributes?.last_name,
        value: bartender?.id,
      });
    });

    setWaitersOptions([...options.values()]);
    return [...options.values()];
  }, [waiters]);

  /**
   * filter to get all the bartenders
   */
  useEffect(() => {
    if (allEmployeeFromDB) {
      const bartenders = allEmployeeFromDB.filter(
        (employeeFromDB) =>
          employeeFromDB?.relationships?.role?.attributes?.slug === "bartender"
      );

      const waiters = allEmployeeFromDB.filter(
        (employeeFromDB) =>
          employeeFromDB?.relationships?.role?.attributes?.slug === "waiter"
      );

      setBartenders(bartenders);
      setWaiters(waiters);
    }
  }, [allEmployeeFromDB]);

  /**
   * handle submit of value
   */
  const submit = () => {
    // validation
    if (selectedBartender.value === undefined) {
      Notification.errorNotification("Bartender is required");
      return;
    }

    if (selectedWaiters.length < 2) {
      Notification.errorNotification("Two or more waiters are required");
      return;
    }

    const waiters = getWaiters(selectedWaiters);

    // actual creating or edit of product
    isEditingShift
      ? ""
      : ShiftAPI.create({
          user_id: selectedBartender?.value,
          creator: currentUserRole,
          waiters: waiters,
        }).then((response) => {
          // adding the created shift to the UI
          if (response.error === 1) {
            Notification.errorNotification(response.message);
          } else {
            setAllShiftsFromDB([response?.shift, ...allShiftsFromDB]);
            Notification.successNotification(response.message);
          }
        });

    // reset the states
    setIsEditingShift(false);
    setShowCreateOrEditShift(false);
  };

  return (
    <section className="relative h-full">
      {/* the title */}
      <div>
        <Title title={isEditingShift ? "Edit Shift." : "Create a Shift."} />
        <Line lineStyles="bg-c_yellow/100 w-[25px] h-[2px]" />
      </div>

      {/* sections of the bartender */}
      <div className={formStyles}>
        <div className="input-group w-[250px] sm:w-[220px] md:w-[240px] ">
          <div className="input">
            <Select
              title="-"
              options={bartendersOptions}
              selected={selectedBartender}
              setSelected={setSelectedBartender}
              inputPlaceHolder="Search by Name"
            />
          </div>

          <label className="placeholder">Select the Bartender</label>
        </div>

        <div className="input-group w-full">
          <div className="input">
            <MultiSelect
              title="-"
              options={waitersOptions}
              setOptions={setWaitersOptions}
              selected={selectedWaiters}
              setSelected={setSelectedWaiters}
              inputPlaceHolder="Search by Name"
            />
          </div>

          <label className="placeholder bg-transparent">
            Select the shift waiters
          </label>
        </div>
      </div>

      <div className={btnWrapper}>
        <Button
          title="Save"
          icon={<BsSave className="w-5 h-5 text-white" />}
          buttonStyles="flex items-center gap-x-2 px-4 py-2 bg-c_yellow rounded-xl text-white"
          buttonTitleWrapperStyles="hidden sm:block"
          purpose={submit}
        />
      </div>
    </section>
  );
};

const formStyles = ctr(`
  overflow-auto 
  scrollbar-hide 
  duration-300 
  gap-4
  h-[200px]
  w-full
  sm:pt-2
  mt-2
  py-8
  pl-1
  flex 
  flex-col
  gap-y-6
`);

const btnWrapper = ctr(`
  mt-[30px] 
  sm:mt-10 
  px-3 
  sm:pr-9 
  flex 
  justify-end  
  absolute 
  bottom-[0px] 
  sm:bottom-0 
  w-fit 
  right-0
`);

export default CreateOrEditShift;
