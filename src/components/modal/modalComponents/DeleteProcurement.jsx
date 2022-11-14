import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { DeleteItem } from "../../";
import { showDeleteProcurementModalState } from "../../../atoms/ModalAtom";
import { globalProcurementState } from "../../../atoms/ProcurementAtom";
import { useProcurement } from "../../../hooks";

const DeleteProcurement = () => {
  /**
   * Component states
   */
  const [globalProcurement, setGlobalProcurement] = useRecoilState(
    globalProcurementState
  );
  const setShowDeleteProcurementModal = useSetRecoilState(
    showDeleteProcurementModalState
  );
  const { deleteProcurement } = useProcurement();

  return (
    <section>
      <DeleteItem
        name={`Procurement : ${globalProcurement?.attributes?.number}`}
        itemDelete={() => {
          deleteProcurement(),
            setGlobalProcurement(null),
            setShowDeleteProcurementModal(false);
        }}
        close={() => {
          setGlobalProcurement(null), setShowDeleteProcurementModal(false);
        }}
      />
    </section>
  );
};

export default DeleteProcurement;
