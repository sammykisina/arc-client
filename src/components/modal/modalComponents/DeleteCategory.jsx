import { useRecoilState, useSetRecoilState } from "recoil";
import { DeleteItem } from "../../";
import { globalCategoryState } from "../../../atoms/CategoryAtom";
import { showDeleteCategoryModalState } from "../../../atoms/ModalAtoms";
import { useCategory } from "../../../hooks";

const DeleteCategory = () => {
  /**
   * Component states
   */
  const [globalCategory, setGlobalCategory] =
    useRecoilState(globalCategoryState);
  const setShowDeleteCategoryModal = useSetRecoilState(
    showDeleteCategoryModalState
  );
  const { deleteCategory } = useCategory();

  return (
    <section>
      <DeleteItem
        name={`Category ${globalCategory?.attributes?.name}`}
        cancelDelete={() => {
          setShowDeleteCategoryModal(false), setGlobalCategory(null);
        }}
        itemDelete={() => {
          deleteCategory(),
            setGlobalCategory(null),
            setShowDeleteCategoryModal(false);
        }}
      />
    </section>
  );
};

export default DeleteCategory;
