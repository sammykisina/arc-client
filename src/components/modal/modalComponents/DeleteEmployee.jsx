import { useRecoilState, useSetRecoilState } from "recoil";
import { globalEmployeeState } from "../../../atoms/EmployeeAtom";
import { showDeleteEmployeeModalState } from "../../../atoms/ModalAtoms";
import { useEmployee } from "../../../hooks";
import { DeleteItem } from "../../";

const DeleteEmployee = () => {
  /**
   * Component states
   */
  const [globalEmployee, setGlobalEmployee] =
    useRecoilState(globalEmployeeState);
  const setShowDeleteEmployeeModal = useSetRecoilState(
    showDeleteEmployeeModalState
  );
  const { deleteEmployee } = useEmployee();

  return (
    <section>
      <DeleteItem
        name={`Employee ${globalEmployee?.attributes?.first_name}  ${globalEmployee?.attributes?.last_name}`}
        cancelDelete={() => {
          setShowDeleteEmployeeModal(false), setGlobalEmployee(null);
        }}
        itemDelete={() => {
          deleteEmployee(),
            setGlobalEmployee(null),
            setShowDeleteEmployeeModal(false);
        }}
      />
    </section>
  );
};

export default DeleteEmployee;
