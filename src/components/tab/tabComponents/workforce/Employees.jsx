import { useEffect } from "react";
import { HiPlusSm } from "react-icons/hi";
import { useSetRecoilState } from "recoil";
import { Button, SpinnerLoader, Table } from "../../../";
import { showCreateOrEditEmployeeModalState } from "../../../../atoms/ModalAtom";
import { useEmployee } from "../../../../hooks";

const Employees = () => {
  /**
   * Component states
   */
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
   * Component functions
   */

  // Fetch All Available Employees
  useEffect(() => {
    getAllEmployeeFromDB();
  }, []);

  return (
    <section className=" relative h-[440px] sm:h-[518px] lg:h-[565px]">
      <section className="mt-2 w-full">
        {isFetchingEmployees ? (
          <div className="mt-24">
            <SpinnerLoader color="fill-[#2C7A51]" />
          </div>
        ) : (
          <Table
            columns={employeesTableColumns}
            data={getEmployeesTableData()}
            showPagination
            showFilters
          />
        )}
      </section>

      <div className="flex justify-end  absolute top-0 right-0 w-fit">
        <Button
          title="Employee"
          icon={<HiPlusSm className="w-5 h-5" />}
          buttonStyles="primary_button"
          buttonTitleWrapperStyles="hidden sm:block md:hidden lg:block"
          purpose={() => {
            setShowCreateOrEditEmployee(true);
          }}
        />
      </div>
    </section>
  );
};

export default Employees;
