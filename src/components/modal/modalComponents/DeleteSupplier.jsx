import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { DeleteItem } from "../../";
import { showDeleteSupplierModalState } from "../../../atoms/ModalAtom";
import { globalSupplierState } from "../../../atoms/SupplierAtom";
import useSuppliersList from "../../../hooks/useSupplier";

const DeleteSupplier = () => {
  /**
   * Component states
   */
  const setShowDeleteSupplierModal = useSetRecoilState(
    showDeleteSupplierModalState
  );
  const [globalSupplier, setGlobalSupplier] =
    useRecoilState(globalSupplierState);
  const { deleteSupplier } = useSuppliersList();

  return (
    <DeleteItem
      name={`Supplier : ${globalSupplier?.attributes?.name}`}
      cancelDelete={() => {
        setGlobalSupplier(null), setShowDeleteSupplierModal(false);
      }}
      itemDelete={() => {
        deleteSupplier(),
          setGlobalSupplier(null),
          setShowDeleteSupplierModal(false);
      }}
      close={() => {
        setGlobalSupplier(null), setShowDeleteSupplierModal(false);
      }}
    />
  );
};

export default DeleteSupplier;
