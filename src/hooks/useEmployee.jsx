import { useMemo, useState } from "react";
import { MdDelete } from "react-icons/md";
import { RiEditCircleFill } from "react-icons/ri";
import { useRecoilState, useSetRecoilState } from "recoil";
import { EmployeeAPI } from "../api/employeeAPI";
import {
  allEmployeesFromDBState,
  globalEmployeeState,
  isEditingEmployeeState,
} from "../atoms/EmployeeAtom";
import {
  showCreateOrEditEmployeeModalState,
  showDeleteEmployeeModalState,
} from "../atoms/ModalAtom";
import { Icon } from "../components";
import {
  AvatarCell,
  DeleteAction,
  EditAction,
  RoleFilter,
  StatusPill,
} from "../components/ui-reusable-small-components/table";
import { employeeRoles } from "../constants";
import { Notification } from "../utils/notifications";

const useEmployee = () => {
  /**
   * Hook states
   */
  const [allEmployeesFromDB, setAllEmployeesFromDB] = useRecoilState(
    allEmployeesFromDBState
  );
  const [globalEmployee, setGlobalEmployee] =
    useRecoilState(globalEmployeeState);
  const setIsEditingEmployee = useSetRecoilState(isEditingEmployeeState);
  const [isFetchingEmployees, setIsFetchingEmployees] = useState(false);
  const setShowCreateOrEditEmployee = useSetRecoilState(
    showCreateOrEditEmployeeModalState
  );
  const setShowDeleteEmployeeModal = useSetRecoilState(
    showDeleteEmployeeModalState
  );
  const [selectedRole, setSelectedRole] = useState("");

  const employeeInputs = [
    [
      {
        name: "first_name",
        label: "First Name",
        required: true,
        errorMessage: "Enter employee first name",
        component: "Input",
        type: "text",
      },
      {
        name: "last_name",
        label: "Last Name",
        required: true,
        errorMessage: "Enter employee last name",
        component: "Input",
        type: "text",
      },
      {
        name: "email",
        label: "Email",
        required: true,
        errorMessage: "Enter employee email",
        component: "Input",
        type: "email",
        gap: true,
      },
      {
        name: "password",
        label: "Login Password",
        required: true,
        errorMessage: "Enter employee password",
        component: "Input",
        type: "password",
      },
    ],
    [
      {
        label: "Employee Role",
        component: "Select",
        selected: selectedRole,
        setSelected: setSelectedRole,
        errorMessage: "Choose employee role",
        options: employeeRoles,
      },
      {
        name: "employee_id",
        label: "Work ID",
        required: true,
        errorMessage: "Enter employee work id",
        component: "Input",
        type: "text",
        gap: true,
      },
    ],
  ];

  const employeesTableColumns = useMemo(
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

  /**
   * hook functions
   */
  const getCurrentAssignedEmployeeIDs = () => {
    const employeeWorkIDs = new Set();

    allEmployeesFromDB?.forEach((employeeFromDB) => {
      employeeWorkIDs.add(employeeFromDB.attributes.work_id);
    });

    return [...employeeWorkIDs.values()];
  };

  const getEmployeeEditData = (
    first_name,
    last_name,
    employee_id,
    email,
    role,
    password
  ) => {
    let employeeEditData = {};

    if (globalEmployee?.attributes?.first_name != first_name)
      employeeEditData = { ...employeeEditData, first_name };

    if (globalEmployee?.attributes?.last_name != last_name)
      employeeEditData = { ...employeeEditData, last_name };

    if (globalEmployee?.attributes?.work_id != employee_id)
      employeeEditData = { ...employeeEditData, work_id: employee_id };

    if (globalEmployee?.attributes?.email != email)
      employeeEditData = { ...employeeEditData, email };

    if (globalEmployee?.relationships?.role?.attributes?.slug != role.value)
      employeeEditData = { ...employeeEditData, role: role.value };

    if (globalEmployee?.attributes?.password != password)
      employeeEditData = { ...employeeEditData, password };

    return employeeEditData;
  };

  const createEmployee = (employeeData) => {
    EmployeeAPI.create(employeeData).then((response) => {
      if (response.error === 1) {
        Notification.errorNotification(response.message);
      } else {
        setAllEmployeesFromDB([response?.employee, ...allEmployeesFromDB]);
        Notification.successNotification(response.message);
      }
    });
  };

  const updateEmployee = (
    editEmployeeData,
    first_name,
    last_name,
    work_id,
    password,
    email,
    selectedRole
  ) => {
    EmployeeAPI.update(globalEmployee?.attributes?.uuid, editEmployeeData).then(
      (response) => {
        if (response.error === 1) {
          Notification.errorNotification(response.message);
        } else {
          const employeeBeingEdited = allEmployeesFromDB.find(
            (employeeFromDB) =>
              employeeFromDB?.attributes?.uuid ===
              globalEmployee?.attributes?.uuid
          );

          const newUpdatedEmployees = allEmployeesFromDB.map((employeeFromDB) =>
            employeeFromDB?.attributes?.uuid ===
            employeeBeingEdited?.attributes?.uuid
              ? {
                  ...employeeBeingEdited,
                  attributes: {
                    ...employeeBeingEdited?.attributes,
                    first_name,
                    last_name,
                    work_id,
                    password,
                    email,
                  },
                  relationships: {
                    ...employeeBeingEdited?.relationships,
                    role: {
                      ...employeeBeingEdited?.relationships?.role,
                      attributes: {
                        ...employeeBeingEdited?.relationships?.role?.attributes,
                        name: selectedRole?.name,
                        slug: selectedRole?.value,
                      },
                    },
                  },
                }
              : employeeFromDB
          );

          setAllEmployeesFromDB(newUpdatedEmployees);
          Notification.successNotification(response.message);
        }

        setIsEditingEmployee(false);
        setGlobalEmployee(null);
      }
    );
  };

  const getEmployeesTableData = () => {
    let employeesData = [];

    allEmployeesFromDB.forEach((employee) => {
      employeesData = [
        ...employeesData,
        {
          name:
            employee?.attributes?.first_name +
            " " +
            employee?.attributes?.last_name,
          email: employee?.attributes?.email,
          title: getEmployeeRoleName(
            employee?.relationships?.role?.attributes.slug
          ),
          status: employee?.attributes?.active ? "active" : "inactive",
          role: employee?.relationships?.role?.attributes?.name,
          actions: [
            <div className="flex gap-x-3" key={employee?.attributes?.uuid}>
              <DeleteAction
                purpose={() => {
                  if (
                    employee?.relationships?.role?.attributes?.slug ===
                    "super-admin"
                  ) {
                    Notification.errorNotification(
                      "You cannot delete the super admin"
                    );
                    return;
                  }

                  setGlobalEmployee(employee);
                  setShowDeleteEmployeeModal(true);
                }}
              />

              <EditAction
                purpose={() => {
                  if (
                    employee.relationships.role?.attributes?.slug ===
                    "super-admin"
                  ) {
                    Notification.errorNotification(
                      "You cannot edit the super admin details"
                    );
                    return;
                  }

                  setGlobalEmployee(employee);
                  setIsEditingEmployee(true);
                  setShowCreateOrEditEmployee(true);
                }}
              />
            </div>,
          ],
        },
      ];
    });

    return employeesData;
  };

  const getAllEmployeeFromDB = () => {
    setIsFetchingEmployees(false);

    EmployeeAPI.getAll()
      .then((employees) => {
        setAllEmployeesFromDB(employees);
      })
      .finally(() => {
        setIsFetchingEmployees(false);
      });
  };

  const getEmployeeRoleName = (role) => {
    switch (role) {
      case "super-admin":
        return "Owner";

      case "admin":
        return "Employee";

      case "bartender":
        return "Employee";

      case "waiter":
        return "Employee";

      case "supplier":
        return "Supplier";

      default:
        "";
    }
  };

  const deleteEmployee = () => {
    EmployeeAPI.delete(globalEmployee?.attributes?.uuid).then((response) => {
      if (response.error === 1) {
        Notification.errorNotification(response.message);
      } else {
        const newEmployees = allEmployeesFromDB.filter(
          (employeeFromDB) =>
            employeeFromDB?.attributes?.uuid != globalEmployee?.attributes?.uuid
        );

        setAllEmployeesFromDB(newEmployees);
        Notification.successNotification(response.message);
      }
    });
  };

  return {
    employeeInputs,
    getCurrentAssignedEmployeeIDs,
    getEmployeeEditData,
    createEmployee,
    updateEmployee,
    employeesTableColumns,
    getEmployeesTableData,
    isFetchingEmployees,
    getAllEmployeeFromDB,
    deleteEmployee,
    selectedRole,
    setSelectedRole,
  };
};

export default useEmployee;
