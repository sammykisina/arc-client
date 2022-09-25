import React, { useEffect, useMemo, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { EmployeeAPI } from "../api/employeeAPI";
import {
  allEmployeesFromDBState,
  isAddingEmployeeState,
  isEditingEmployeeState,
} from "../atoms/EmployeeAtom";
import {
  showAddOrEditEmployeeModalState,
  showDeleteEmployeeModalState,
} from "../atoms/ModalAtoms";
import { Button, Icon, SpinnerLoader, Table } from "../components";
import {
  AvatarCell,
  SelectColumnFilter,
  StatusPill,
  RoleFilter,
} from "../components/ui-reusable-small-components/table";
import { getEmployeeTitle } from "../utils/app";
import { MdDelete } from "react-icons/md";
import { RiEditCircleFill } from "react-icons/ri";
import { globalItemHolderState } from "../atoms/AppAtoms";
import { Notification } from "../utils/notifications";

const Employee = () => {
  // page states
  const setShowAddOrEditEmployee = useSetRecoilState(
    showAddOrEditEmployeeModalState
  );
  const [isFetching, setIsFetching] = useState(false);
  const [allEmployeesFromDB, setAllEmployeesFromDB] = useRecoilState(
    allEmployeesFromDBState
  );
  const [isAddingEmployee, setIsAddingEmployee] = useRecoilState(
    isAddingEmployeeState
  );
  const setGlobalItemHolder = useSetRecoilState(globalItemHolderState);
  const setShowDeleteEmployeeModal = useSetRecoilState(
    showDeleteEmployeeModalState
  );
  const setIsEditingEmployee = useSetRecoilState(isEditingEmployeeState);

  // employees table columns
  const employeesTableColumn = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: AvatarCell,
        emailAccessor: "email",
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: StatusPill,
      },
      {
        Header: "Role",
        accessor: "role",
        Filter: RoleFilter,
        filter: "include",
      },
      {
        Header: "Actions",
        accessor: "actions",
      },
    ],
    []
  );

  // page functions

  /**
   * modify the data to a format acceptable by the table component
   *
   * @return []
   */
  const modifyData = () => {
    let employeeData = [];
    allEmployeesFromDB.forEach((employee) => {
      employeeData = [
        ...employeeData,
        {
          name:
            employee?.attributes?.first_name +
            " " +
            employee?.attributes?.last_name,
          email: employee?.attributes?.email,
          title: getEmployeeTitle(
            employee?.relationships?.role?.attributes.slug
          ),
          status: employee?.attributes?.active ? "active" : "inactive",
          role: employee?.relationships?.role?.attributes.name,
          actions: [
            <div className="flex gap-x-3" key={employee?.attributes?.uuid}>
              <Icon
                icon={<MdDelete className="deleteActionButton " />}
                purpose={() => handleDelete(employee)}
              />
              <Icon
                icon={<RiEditCircleFill className="editActionButton" />}
                purpose={() => handleEdit(employee)}
              />
            </div>,
          ],
        },
      ];
    });

    return employeeData;
  };

  /**
   * fetch all available employees
   */
  useEffect(() => {
    setIsFetching(false);

    EmployeeAPI.getAll()
      .then((employees) => {
        setAllEmployeesFromDB(employees);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  /**
   * delete an employee
   */
  const handleDelete = (employee) => {
    /**
     * Prevent deleting the super admin
     */
    if (employee?.relationships?.role?.attributes?.slug === "super-admin") {
      Notification.errorNotification("You cannot delete the super admin");
      return;
    }
    // display the delete confirmation modal
    setGlobalItemHolder(employee);

    // open the confirmation model
    setShowDeleteEmployeeModal(true);
  };

  /**
   * edit a employee
   */
  const handleEdit = (employee) => {
    /**
     * prevent the edit of the super admin data (its created by the system and thus cant be changed)
     */
    if (employee.relationships.role?.attributes?.slug === "super-admin") {
      Notification.errorNotification("You cannot edit the super admin details");
      return;
    }

    // set states
    setGlobalItemHolder(employee);
    setIsEditingEmployee(true);
    setShowAddOrEditEmployee(true);
  };

  return (
    <section>
      {/* the create employee button */}
      <Button
        title="Employee"
        icon={<HiPlus className="w-5 h-5 text-c_white" />}
        buttonStyles="primaryButton"
        buttonTitleWrapperStyles="hidden sm:block"
        purpose={() => {
          setIsAddingEmployee(true);
          setShowAddOrEditEmployee(true);
        }}
      />

      {/* the table */}
      <div className="mt-6 w-full">
        {isFetching ? (
          <SpinnerLoader />
        ) : (
          <Table
            columns={employeesTableColumn}
            data={modifyData()}
            showPagination
            showFilters
          />
        )}
      </div>
    </section>
  );
};

export default Employee;
