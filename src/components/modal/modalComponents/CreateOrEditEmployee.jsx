import React, { useEffect, useState } from "react";
import { BsSave } from "react-icons/bs";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  globalEmployeeState,
  isEditingEmployeeState,
} from "../../../atoms/EmployeeAtom";
import { showCreateOrEditEmployeeModalState } from "../../../atoms/ModalAtoms";
import { useForm } from "react-hook-form";
import { Title, Select, Button, Line } from "../..";
import { Notification } from "../../../utils/notifications";
import ctr from "@netlify/classnames-template-literals";
import { useEmployee } from "../../../hooks";

const CreateOrEditEmployee = () => {
  /**
   * component states
   */
  const [selectedRole, setSelectedRole] = useState("");
  const [isEditingEmployee, setIsEditingEmployee] = useRecoilState(
    isEditingEmployeeState
  );
  const setShowCreateEmployeeModal = useSetRecoilState(
    showCreateOrEditEmployeeModalState
  );
  const globalEmployee = useRecoilValue(globalEmployeeState);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const {
    employeeInputs,
    getCurrentAssignedEmployeeIDs,
    getEmployeeEditData,
    createEmployee,
    editEmployee,
  } = useEmployee();

  /**
   * components functions
   */

  // handle submit of new employee details
  const onSubmit = ({
    first_name,
    last_name,
    employee_id,
    password,
    email,
  }) => {
    // validation
    if (selectedRole.value === "") {
      Notification.errorNotification("Select the user role");
      return;
    }

    // validating if the given employee_id has been taken
    if (
      !isEditingEmployee &&
      getCurrentAssignedEmployeeIDs().includes(parseInt(employee_id))
    ) {
      Notification.errorNotification("The Given employee id is taken");
      return;
    }

    // when editing
    let employeeEditData = {};
    if (isEditingEmployee) {
      employeeEditData = getEmployeeEditData(
        first_name,
        last_name,
        employee_id,
        email,
        selectedRole,
        password
      );

      if (Object.keys(employeeEditData).length === 0) {
        setGlobalItemHolder(null),
          setIsEditingEmployee(false),
          setShowCreateEmployeeModal(false),
          Notification.errorNotification("Nothing to edit");
        return;
      }
    }

    // actual creating or editing of the employee
    isEditingEmployee
      ? editEmployee(
          employeeEditData,
          first_name,
          last_name,
          employee_id,
          password,
          email,
          selectedRole
        )
      : createEmployee({
          first_name,
          last_name,
          email,
          password,
          work_id: employee_id,
          role: selectedRole.value,
        });

    setShowCreateEmployeeModal(false);
  };

  /**
   * set the default values when editing
   */
  useEffect(() => {
    if (globalEmployee) {
      reset({
        first_name: globalEmployee?.attributes?.first_name,
        last_name: globalEmployee?.attributes?.last_name,
        employee_id: globalEmployee?.attributes?.work_id,
        password: globalEmployee?.attributes?.password,
        email: globalEmployee?.attributes?.email,
      });

      setSelectedRole({
        name: globalEmployee?.relationships?.role?.attributes.name,
        value: globalEmployee?.relationships?.role?.attributes.slug,
      });
    }
  }, [globalEmployee]);

  return (
    <section className="relative">
      {/* title */}
      <Title
        title={isEditingEmployee ? "Edit Employee" : "Create an Employee."}
      />

      <Line lineStyles="bg-c_yellow/100 w-[25px] h-[5px] rounded-full" />
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
