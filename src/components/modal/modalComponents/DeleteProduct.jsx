import { useRecoilState, useSetRecoilState } from "recoil";
import { globalProductState } from "../../../atoms/ProductAtom";
import { showDeleteProductModalState } from "../../../atoms/ModalAtom";
import { DeleteItem } from "../../";
import { useProduct } from "../../../hooks";

const DeleteProduct = () => {
  /**
   * Components states
   */
  const [globalProduct, setGlobalProduct] = useRecoilState(globalProductState);
  const setShowDeleteProductModal = useSetRecoilState(
    showDeleteProductModalState
  );
  const { deleteProduct } = useProduct();

  return (
    <section>
      <DeleteItem
        name={`Product : ${globalProduct?.attributes?.name}`}
        cancelDelete={() => {
          setShowDeleteProductModal(false), setGlobalProduct(null);
        }}
        itemDelete={() => {
          deleteProduct(),
            setGlobalProduct(null),
            setShowDeleteProductModal(false);
        }}
        close={() => {
          setGlobalProduct(null), setShowDeleteProductModal(false);
        }}
      />
    </section>
  );
};

export default DeleteProduct;
