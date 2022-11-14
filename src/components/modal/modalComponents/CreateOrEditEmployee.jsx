import React, { useEffect, useState } from "react";
import { BsSave } from "react-icons/bs";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  globalEmployeeState,
  isEditingEmployeeState,
} from "../../../atoms/EmployeeAtom";
import { showCreateOrEditEmployeeModalState } from "../../../atoms/ModalAtom";
import { useForm } from "react-hook-form";
import { Title, Select, Button, Line, ModalHeader } from "../..";
import { Notification } from "../../../utils/notifications";
import { useEmployee } from "../../../hooks";

const CreateOrEditEmployee = () => {
  /**
   * component states
   */
  const [isEditingEmployee, setIsEditingEmployee] = useRecoilState(
    isEditingEmployeeState
  );
  const setShowCreateEmployeeModal = useSetRecoilState(
    showCreateOrEditEmployeeModalState
  );
  const [globalEmployee, setGlobalEmployee] =
    useRecoilState(globalEmployeeState);

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
    updateEmployee,
    selectedRole,
    setSelectedRole,
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
      ? updateEmployee(
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
    <section className="space-y-2 relative">
      {/* Header */}
      <section>
        <ModalHeader
          close={() => {
            setGlobalEmployee(null),
              setIsEditingEmployee(false),
              setShowCreateEmployeeModal(false);
          }}
          isEditing={isEditingEmployee}
          editTitle="Editing Employee"
          createTitle="Creating An Employee"
        />
      </section>

      {/* Body */}
      <form className="" onSubmit={handleSubmit(onSubmit)}>
        <div className="h-[350px] sm:h-fit overflow-y-auto sm:grid grid-cols-2 gap-x-2 px-4 space-y-4 sm:space-y-0 border-b divide-y sm:divide-y-0 sm:divide-x  divide-c_yellow sm:pb-2 sm:max-h-[250px]">
          {/* General Employee Info Section */}
          <section className="space-y-3">
            <Title title="General Info." />

            <div className="space-y-3">
              {employeeInputs[0].map((employeeInput, employeeInputIndex) => (
                <div className={`input-group`} key={employeeInputIndex}>
                  <input
                    type={employeeInput.type}
                    placeholder=""
                    {...register(employeeInput.name, {
                      required: employeeInput.required,
                    })}
                    readOnly={employeeInput.readonly}
                    className="input"
                  />

                  <label className="placeholder border">
                    {employeeInput.label}
                  </label>

                  {errors[employeeInput.name] && (
                    <span className="error">{employeeInput.errorMessage}</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Specific Employee Info Section */}
          <section className="space-y-4 py-2 sm:py-0 sm:px-2">
            <Title title="Specific Info." />

            <div className="space-y-3">
              {employeeInputs[1].map((employeeInput, employeeInputIndex) => (
                <div className="" key={employeeInputIndex}>
                  {employeeInput.component === "Select" ? (
                    <Select
                      title=""
                      options={employeeInput.options}
                      selectWrapperStyles={`w-full rounded-md ring-c_gray  py-2 px-2`}
                      selectPanelStyles="ring-c_gray/40 shadow h-[90px]"
                      selected={employeeInput.selected}
                      setSelected={(option) =>
                        employeeInput.setSelected(option)
                      }
                      selectLabel={employeeInput.label}
                      selectLabelStyles="border text-c_dark/50 rounded-full px-1"
                    />
                  ) : (
                    <div className={`input-group`}>
                      <input
                        type={employeeInput.type}
                        placeholder=""
                        {...register(employeeInput.name, {
                          required: employeeInput.required,
                        })}
                        readOnly={employeeInput.readonly}
                        className="input"
                      />

                      <label className="placeholder border">
                        {employeeInput.label}
                      </label>

                      {errors[employeeInput.name] && (
                        <span className="error">
                          {employeeInput.errorMessage}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="absolute -bottom-[50px] px-4 right-0">
          <Button
            title="Save"
            type="submit"
            icon={<BsSave className="w-5 h-5" />}
            buttonStyles="primary_button"
            buttonTitleWrapperStyles="hidden sm:block"
          />
        </div>
      </form>
    </section>
  );
};
export default CreateOrEditEmployee;
