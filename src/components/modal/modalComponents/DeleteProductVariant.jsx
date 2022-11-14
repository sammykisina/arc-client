import { useRecoilState, useSetRecoilState } from "recoil";
import { globalProductVariantState } from "../../../atoms/VariantAtom";
import { showDeleteProductVariantModalState } from "../../../atoms/ModalAtom";
import { globalProductState } from "../../../atoms/ProductAtom";
import { DeleteItem } from "../../";
import { useProductVariant } from "../../../hooks";

const DeleteProductVariant = () => {
  /**
   * Component states
   */
  const [globalProductVariant, setGlobalProductVariant] = useRecoilState(
    globalProductVariantState
  );
  const setGlobalProduct = useSetRecoilState(globalProductState);
  const setShowDeleteProductVariantModal = useSetRecoilState(
    showDeleteProductVariantModalState
  );
  const { deleteProductVariant } = useProductVariant();

  return (
    <section>
      <DeleteItem
        name={`Variant ${globalProductVariant?.attributes?.name} (${globalProductVariant?.attributes?.measure}ml)`}
        cancelDelete={() => {
          setGlobalProduct(null),
            setGlobalProductVariant(null),
            setShowDeleteProductVariantModal(false);
        }}
        itemDelete={() => {
          deleteProductVariant(), setShowDeleteProductVariantModal(false);
        }}
      />
    </section>
  );
};

export default DeleteProductVariant;
