import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { DeleteItem } from "../../";
import { showDeleteTableModalState } from "../../../atoms/ModalAtoms";
import { globalTableState } from "../../../atoms/TableAtom";
import { useTable } from "../../../hooks";

const DeleteTable = () => {
  // component states
  const [globalTable, setGlobalTable] = useRecoilState(globalTableState);
  const setShowDeleteTableModal = useSetRecoilState(showDeleteTableModalState);
  const { deleteTable, cancel } = useTable();

  // component functions
  const cancelDelete = () => {
    setShowDeleteTableModal(false);
    setGlobalTable(null);
  };

  const tableDelete = () => {
    deleteTable(globalTable?.attributes?.uuid);
    setShowDeleteTableModal(false);
    setGlobalTable(null);
  };

  return (
    <section>
      <DeleteItem
        name={`Table ${globalTable?.attributes?.name}`}
        cancelDelete={cancelDelete}
        itemDelete={tableDelete}
      />
    </section>
  );
};

export default DeleteTable;
