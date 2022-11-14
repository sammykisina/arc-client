import { useRecoilState, useSetRecoilState } from "recoil";
import { DeleteItem } from "../../";
import { showDeleteTableModalState } from "../../../atoms/ModalAtom";
import { globalTableState } from "../../../atoms/TableAtom";
import { useTable } from "../../../hooks";

const DeleteTable = () => {
  // component states
  const [globalTable, setGlobalTable] = useRecoilState(globalTableState);
  const setShowDeleteTableModal = useSetRecoilState(showDeleteTableModalState);
  const { deleteTable } = useTable();

  return (
    <section>
      <DeleteItem
        name={`Table : ${globalTable?.attributes?.name}`}
        itemDelete={() => {
          deleteTable(), setGlobalTable(null), setShowDeleteTableModal(false);
        }}
        close={() => {
          setGlobalTable(null), setShowDeleteTableModal(false);
        }}
      />
    </section>
  );
};

export default DeleteTable;
