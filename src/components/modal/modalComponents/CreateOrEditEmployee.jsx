import React, { useEffect, useState } from "react";
import { BsSave } from "react-icons/bs";
import { useRecoilState, useSetRecoilState } from "recoil";
import { globalItemHolderState } from "../../../atoms/AppAtoms";
import {
  isAddingEmployeeState,
  allEmployeesFromDBState,
  isEditingEmployeeState,
} from "../../../atoms/EmployeeAtom";
import { showAddOrEditEmployeeModalState } from "../../../atoms/ModalAtoms";
import { EmployeeAPI } from "../../../api/employeeAPI";
import { useForm } from "react-hook-form";
import { Title, Select, Button, Line } from "../..";
import {
  getCurrentAssignedEmployeeIDs,
  getEmployeeEditData,
} from "../../../utils/employee";
import { Notification } from "../../../utils/notifications";
import ctr from "@netlify/classnames-template-literals";
import { useEmployee } from "../../../hooks";

const CreateOrEditEmployee = () => {
  /**
   * component states
   */
  const [selectedRole, setSelectedRole] = useState("");
  const setIsAddingEmployee = useSetRecoilState(isAddingEmployeeState);
  const [isEditingEmployee, setIsEditingEmployee] = useRecoilState(
    isEditingEmployeeState
  );
  const setShowAddEmployeeModal = useSetRecoilState(
    showAddOrEditEmployeeModalState
  );
  const [allEmployeesFromDB, setAllEmployeesFromDB] = useRecoilState(
    allEmployeesFromDBState
  );
  const [globalItemHolder, setGlobalItemHolder] = useRecoilState(
    globalItemHolderState
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { employeeInputs } = useEmployee();

  // components functions

  /**
   * handle submit of new employee details
   */
  const onSubmit = ({
    first_name,
    last_name,
    employee_id,
    password,
    email,
  }) => {
    console.log("here");
    // validation
    if (selectedRole.value === "") {
      Notification.errorNotification("Select the user role");
      return;
    }

    // validating if the given employee_id has been taken
    if (
      !isEditingEmployee &&
      getCurrentAssignedEmployeeIDs(allEmployeesFromDB).includes(
        parseInt(employee_id)
      )
    ) {
      Notification.errorNotification("The Given employee id is taken");
      return;
    }

    // check if the data changed when trying to edit
    const editData = getEmployeeEditData(
      globalItemHolder,
      first_name,
      last_name,
      employee_id,
      email,
      selectedRole,
      password
    );

    // if editing and there is no data to edit then return
    if (isEditingEmployee && Object.keys(editData).length === 0) {
      setGlobalItemHolder(null);
      setIsEditingEmployee(false);
      setShowAddEmployeeModal(false);
      Notification.errorNotification("Nothing to edit");

      return;
    }

    // actual adding or edit employee in the DB
    isEditingEmployee && globalItemHolder
      ? EmployeeAPI.update(globalItemHolder?.attributes?.uuid, editData).then(
          (response) => {
            /**
             * updating the employee
             */

            //  find the employee being edited
            const editedEmployee = allEmployeesFromDB.find(
              (employeeFromDB) =>
                employeeFromDB?.attributes?.uuid ===
                globalItemHolder?.attributes?.uuid
            );

            // create a new updated array of the employee
            const updatedEmployees = allEmployeesFromDB.map((employeeFromDB) =>
              employeeFromDB?.attributes?.uuid ===
              editedEmployee?.attributes?.uuid
                ? {
                    ...editedEmployee,
                    attributes: {
                      ...editedEmployee?.attributes,
                      first_name: first_name,
                      last_name: last_name,
                      work_id: employee_id,
                      password: password,
                      email: email,
                    },
                    relationships: {
                      ...editedEmployee?.relationships,
                      role: {
                        ...editedEmployee?.relationships?.role,
                        attributes: {
                          ...editedEmployee?.relationships?.role?.attributes,
                          name: selectedRole?.name,
                          slug: selectedRole?.value,
                        },
                      },
                    },
                  }
                : employeeFromDB
            );

            // set new employee list
            setAllEmployeesFromDB(updatedEmployees);

            // refresh the browser to remove the updated employee  data from the Ui
            if (response.error === 1) window.location.reload(false);

            response.error === 1
              ? Notification.errorNotification(response.message)
              : Notification.successNotification(response.message);
          }
        )
      : EmployeeAPI.create({
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: password,
          work_id: employee_id,
          role: selectedRole.value,
        }).then((response) => {
          // refresh the browser to remove the added employee from the Ui
          if (response.error === 1) window.location.reload(false);

          // false adding to UI
          setAllEmployeesFromDB([...allEmployeesFromDB, response?.user]);

          // notifications
          response.error === 1
            ? Notification.errorNotification(response.message)
            : Notification.successNotification(response.message);
        });

    // reset the states
    setIsAddingEmployee(false);
    setShowAddEmployeeModal(false);
  };

  /**
   * set the default values when editing
   */
  useEffect(() => {
    if (globalItemHolder) {
      reset({
        first_name: globalItemHolder?.attributes?.first_name,
        last_name: globalItemHolder?.attributes?.last_name,
        employee_id: globalItemHolder?.attributes?.work_id,
        password: globalItemHolder?.attributes?.password,
        email: globalItemHolder?.attributes?.email,
      });

      setSelectedRole({
        name: globalItemHolder?.relationships?.role?.attributes.name,
        value: globalItemHolder?.relationships?.role?.attributes.slug,
      });
    }
  }, [globalItemHolder]);

  return (
    <section className="relative">
      {/* title */}
      <Title
        title={isEditingEmployee ? "Edit Employee" : "Create an Employee."}
      />

      <Line lineStyles="bg-c_yellow/100 w-[25px] h-[2px]" />
      {/* fields */}
      <form className={formStyles} onSubmit={handleSubmit(onSubmit)}>
        {employeeInputs.map((employeeInput, employeeInputIndex) => (
          <div
            key={employeeInputIndex}
            className={`h-fit ${employeeInput.gap && "mt-5 sm:mt-0 "}`}
          >
            {employeeInput.component === "Input" ? (
              <div className="input-group w-[250px] sm:w-[220px] md:w-[240px]">
                <input
                  type={employeeInput.type}
                  placeholder=""
                  {...register(employeeInput.name, { required: true })}
                  className="input"
                />

                <label className="placeholder">{employeeInput.label}</label>

                {errors[employeeInput.name] && (
                  <span className="error">{employeeInput.errorMessage}</span>
                )}
              </div>
            ) : (
              <div className="input-group w-[250px] sm:w-[220px] md:w-[240px]">
                <div className="input">
                  <Select
                    title="-"
                    options={employeeInput.options}
                    selected={selectedRole}
                    setSelected={setSelectedRole}
                  />
                </div>

                <label className="placeholder">{employeeInput.label}</label>
              </div>
            )}
          </div>
        ))}

        <div className={btnWrapper}>
          <Button
            title="Save"
            type="submit"
            icon={<BsSave className="w-5 h-5 text-white" />}
            buttonStyles="primaryButton"
            buttonTitleWrapperStyles="hidden sm:block"
          />
        </div>
      </form>
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
  items-center
  duration-300 
  gap-4
  h-[350px]
  w-full
  sm:h-[220px]
  sm:pt-2
  mt-2
  py-8
  sm:py-5
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
  -bottom-[50px] 
  sm:-bottom-[60px] 
  w-fit 
  right-0
`);
export default CreateOrEditEmployee;
