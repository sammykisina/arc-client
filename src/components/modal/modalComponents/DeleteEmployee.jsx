import React from "react";
import { MdCancel, MdDelete } from "react-icons/md";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Title, Button } from "../..";
import { EmployeeAPI } from "../../../api/employeeAPI";
import { globalItemHolderState } from "../../../atoms/AppAtoms";
import { allEmployeesFromDBState } from "../../../atoms/EmployeeAtom";
import { showDeleteEmployeeModalState } from "../../../atoms/ModalAtoms";
import { Notification } from "../../../utils/notifications";

const DeleteEmployee = () => {
  //  component states
  const [globalItemHolder, setGlobalItemHolder] = useRecoilState(
    globalItemHolderState
  );
  const setShowDeleteEmployeeModal = useSetRecoilState(
    showDeleteEmployeeModalState
  );
  const [allEmployeesFromDB, setAllEmployeesFromDB] = useRecoilState(
    allEmployeesFromDBState
  );

  // component functions

  /**
   * delete the employee
   */
  const deleteEmployee = () => {
    EmployeeAPI.delete(globalItemHolder.attributes.uuid).then((response) => {
      if (response.error === 0) {
        // filter the current employees to remove the deleted one
        const newEmployees = allEmployeesFromDB.filter(
          (employeeFromDB) =>
            employeeFromDB?.attributes?.uuid !==
            globalItemHolder?.attributes?.uuid
        );
        setAllEmployeesFromDB(newEmployees);
      }

      response.error === 1
        ? Notification.errorNotification(response.message)
        : Notification.successNotification(response.message);

      setGlobalItemHolder(null);
      setShowDeleteEmployeeModal(false);
    });
  };

  return (
    <section>
      {/* title */}
      <Title
        title="Delete Employee."
        titleStyles="text-lg text-c_dark font-bold text-shadow"
      />

      {/* confirmation method */}
      <div className="flex justify-center mt-4 text-c_dark">
        <p className="border border-c_gray/20 w-[70%] px-3 py-1 rounded-md flex flex-col gap-y-3">
          {`Are you sure you want to delete ${
            globalItemHolder?.attributes?.first_name +
            " " +
            globalItemHolder?.attributes?.last_name
          } with role ${
            globalItemHolder?.relationships?.roles?.attributes?.name
          }.`}

          <span className="font-semibold text-red-500 text-sm">
            Be aware! This action is not reversible.
          </span>
        </p>
      </div>

      {/* the decision control buttons */}
      <div className="mt-10 flex justify-end gap-x-4">
        <Button
          title="Delete"
          icon={<MdDelete className="w-5 h-5 text-white" />}
          buttonStyles="flex items-center gap-x-2 px-4 py-2 bg-red-500 rounded-xl text-white disabled:bg-c_yellow/10"
          purpose={deleteEmployee}
        />

        <Button
          title="Cancel"
          icon={<MdCancel className="w-5 h-5 text-white" />}
          buttonStyles="flex items-center gap-x-2 px-4 py-2 bg-c_yellow rounded-xl text-white disabled:bg-c_yellow/10"
          purpose={() => {
            setGlobalItemHolder(null);
            setShowDeleteEmployeeModal(false);
          }}
        />
      </div>
    </section>
  );
};

export default DeleteEmployee;
