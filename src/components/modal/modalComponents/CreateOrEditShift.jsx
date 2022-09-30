import { useState, useEffect, useMemo } from "react";
import { BsSave } from "react-icons/bs";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { isEditingShiftState } from "../../../atoms/ShiftAtom";
import { currentUserRoleState } from "../../../atoms/AppAtoms";
import { showCreateOrEditShiftState } from "../../../atoms/ModalAtoms";
import { allEmployeesFromDBState } from "../../../atoms/EmployeeAtom";
import { ShiftAPI } from "../../../api/shiftApi";
import { Title, Select, Line, Button } from "../../";
import ctr from "@netlify/classnames-template-literals";
import { Notification } from "../../../utils/notifications";
import { getWaiters } from "../../../utils/shift";
import useShift from "../../../hooks/useShift";

const CreateOrEditShift = () => {
  /**
   * Component states
   */
  const isEditingShift = useRecoilValue(isEditingShiftState);
  const currentUserRole = useRecoilValue(currentUserRoleState);
  const setShowCreateOrEditShift = useSetRecoilState(
    showCreateOrEditShiftState
  );
  const {
    getBartenderOptions,
    getWaitersOptions,
    createShift,
    generateSelectedWaitersIds,
  } = useShift();
  const [selectedBartender, setSelectedBartender] = useState("");
  const [selectedWaiters, setSelectedWaiters] = useState([]);

  /**
   * Component functions
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

    const waiters = generateSelectedWaitersIds(selectedWaiters);

    // actual creating or edit of product
    isEditingShift
      ? ""
      : createShift({
          user_id: selectedBartender?.value,
          creator: currentUserRole,
          waiters: waiters,
        });

    setShowCreateOrEditShift(false);
  };

  return (
    <section className="h-full">
      {/* the title */}
      <div className="pb-2">
        <Title title={isEditingShift ? "Edit Shift." : "Create a Shift."} />
        <Line lineStyles="bg-c_yellow/100 w-[25px] h-[5px] rounded-full" />
      </div>

      {/* sections of the bartender */}
      <div className="mt-4 sm:mt-0 h-[170px] sm:h-[100px] flex gap-5 flex-col sm:flex-row justify-center items-center">
        <Select
          title="-"
          options={getBartenderOptions}
          selectWrapperStyles="w-full sm:w-[15em] rounded-xl ring-c_gray/40 p-[.5em]"
          selectPanelStyles="ring-c_gray/40 shadow max-h-[10em] sm:max-h-[5em]"
          selected={selectedBartender}
          setSelected={(option) => setSelectedBartender(option)}
          selectLabel="Select Shift Bartender"
          selectLabelStyles="text-c_dark"
        />

        <Select
          title="-"
          options={getWaitersOptions}
          selectWrapperStyles="w-full sm:w-[15em] rounded-xl ring-c_gray/40 p-[.5em]"
          selectPanelStyles="ring-c_gray/40 shadow max-h-[5em]"
          selected={selectedWaiters}
          multiple
          setSelected={(option) => setSelectedWaiters(option)}
          selectLabel="Select Shift Bartender"
          selectLabelStyles="text-c_dark"
        />
      </div>

      <div className="flex justify-end">
        <div className=" ">
          <Button
            title="Save"
            icon={<BsSave className="w-5 h-5 text-white" />}
            buttonStyles="flex items-center gap-x-2 px-4 py-2 bg-c_yellow rounded-xl text-white "
            buttonTitleWrapperStyles="hidden sm:block"
            purpose={submit}
          />
        </div>
      </div>
    </section>
  );
};

export default CreateOrEditShift;
