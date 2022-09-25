import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { globalItemHolderState } from "../../../atoms/AppAtoms";
import { Button, Title } from "../../";
import { MdCancel, MdDelete } from "react-icons/md";
import {
  allCategoriesFromDBState,
  globalCategoryState,
  showDeleteCategoryModalState,
} from "../../../atoms/CategoryAtom";
import { CategoryAPI } from "../../../api/categoryAPI";
import { Notification } from "../../../utils/notifications";

const DeleteCategory = () => {
  // component states
  const [globalCategory, setGlobalCategory] =
    useRecoilState(globalCategoryState);
  const setShowDeleteCategoryModal = useSetRecoilState(
    showDeleteCategoryModalState
  );
  const [allCategoriesFromDB, setAllCategoriesFromDB] = useRecoilState(
    allCategoriesFromDBState
  );

  // component functions
  /**
   * delete the category
   */
  const deleteCategory = () => {
    CategoryAPI.delete(globalCategory?.attributes?.uuid).then((response) => {
      if (response.error === 0) {
        // filter the current categories to remove the deleted one
        const newCategories = allCategoriesFromDB.filter(
          (categoryFromDB) =>
            categoryFromDB?.attributes?.uuid !=
            globalCategory?.attributes?.uuid
        );
        // set the new filtered categories
        setAllCategoriesFromDB(newCategories);
      }

      // notifications
      response.error === 1
        ? Notification.errorNotification(response.message)
        : Notification.successNotification(response.message);

      // reset the state
      setGlobalCategory(null);
      setShowDeleteCategoryModal(false);
    });
  };

  return (
    <section>
      {/* title */}
      <Title title="Delete Category." />

      {/* confirmation */}
      <div className="flex justify-center mt-4 text-c_dark">
        <p className="border border-c_gray/20 w-[70%] px-3 py-1 rounded-md flex flex-col gap-y-3">
          {`Are you sure you want to delete the category ${globalCategory?.attributes?.name}`}

          <span className="font-semibold text-red-500 text-sm">
            Be aware! This action is not reversible.
          </span>
        </p>
      </div>

      {/* the decision control buttons */}
      <div className="mt-10 flex justify-end gap-x-4">
        <Button
          title="Delete"
          icon={<MdDelete className="w-5 h-5 text-white" />}
          buttonStyles="flex items-center gap-x-2 px-4 py-2 bg-red-500 rounded-xl text-white disabled:bg-c_yellow/10"
          purpose={deleteCategory}
        />

        <Button
          title="Cancel"
          icon={<MdCancel className="w-5 h-5 text-white" />}
          buttonStyles="flex items-center gap-x-2 px-4 py-2 bg-c_yellow rounded-xl text-white disabled:bg-c_yellow/10"
          purpose={() => {
            setGlobalCategory(null);
            setShowDeleteCategoryModal(false);
          }}
        />
      </div>
    </section>
  );
};

export default DeleteCategory;
