import React, { useEffect } from "react";
import { HiPlus } from "react-icons/hi";
import { useSetRecoilState } from "recoil";
import { showCreateOrEditEmployeeModalState } from "../atoms/ModalAtoms";
import { Button, SpinnerLoader, Table } from "../components";
import { useEmployee } from "../hooks";

const Employee = () => {
  // page states
  const setShowCreateOrEditEmployee = useSetRecoilState(
    showCreateOrEditEmployeeModalState
  );
  const {
    employeesTableColumns,
    getEmployeesTableData,
    isFetchingEmployees,
    getAllEmployeeFromDB,
  } = useEmployee();

  /**
   * fetch all available employees
   */
  useEffect(() => {
    getAllEmployeeFromDB();
  }, []);

  return (
    <section>
      {/* the create employee button */}
      <Button
        title="Employee"
        icon={<HiPlus className="w-5 h-5 text-c_white" />}
        buttonStyles="primaryButton"
        buttonTitleWrapperStyles="hidden sm:block"
        purpose={() => setShowCreateOrEditEmployee(true)}
      />

      {/* the table */}
      <div className="mt-6 w-full">
        {isFetchingEmployees ? (
          <SpinnerLoader />
        ) : (
          <Table
            columns={employeesTableColumns}
            data={getEmployeesTableData()}
            showPagination
            showFilters
          />
        )}
      </div>
    </section>
  );
};

export default Employee;
