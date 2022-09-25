import { useRecoilState, useSetRecoilState } from "recoil";
import { globalEmployeeState } from "../../../atoms/EmployeeAtom";
import { showDeleteEmployeeModalState } from "../../../atoms/ModalAtoms";
import { useEmployee } from "../../../hooks";
import { DeleteItem } from "../../";

const DeleteEmployee = () => {
  //  component states
  const [globalEmployee, setGlobalEmployee] =
    useRecoilState(globalEmployeeState);
  const setShowDeleteEmployeeModal = useSetRecoilState(
    showDeleteEmployeeModalState
  );
  const { deleteEmployee } = useEmployee();

  /**
   * component functions
   */
  const cancelDelete = () => {
    setShowDeleteEmployeeModal(false);
    setGlobalEmployee(null);
  };

  const employeeDelete = () => {
    deleteEmployee(globalEmployee?.attributes?.uuid);
    setGlobalEmployee(null);
    setShowDeleteEmployeeModal(false);
  };

  return (
    <section>
      <DeleteItem
        name={`Employee ${globalEmployee?.attributes?.first_name}  ${globalEmployee?.attributes?.last_name}`}
        cancelDelete={cancelDelete}
        itemDelete={employeeDelete}
      />
    </section>
  );
};

export default DeleteEmployee;
