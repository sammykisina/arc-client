import { useRecoilState, useSetRecoilState } from "recoil";
import { DeleteItem } from "../../";
import { globalCategoryState } from "../../../atoms/CategoryAtom";
import { showDeleteCategoryModalState } from "../../../atoms/ModalAtom";
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
        name={`Category : ${globalCategory?.attributes?.name}`}
        itemDelete={() => {
          deleteCategory(),
            setShowDeleteCategoryModal(false),
            setGlobalCategory(null);
        }}
        close={() => {
          setShowDeleteCategoryModal(false), setGlobalCategory(null);
        }}
      />
    </section>
  );
};

export default DeleteCategory;
