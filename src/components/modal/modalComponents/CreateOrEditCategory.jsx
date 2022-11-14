import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BsSave } from "react-icons/bs";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  globalCategoryState,
  isEditingCategoryState,
} from "../../../atoms/CategoryAtom";
import { Notification } from "../../../utils/notifications";
import { Button, ModalHeader } from "../../";
import { showCreateOrEditCategoryModalState } from "../../../atoms/ModalAtom";
import { useCategory } from "../../../hooks";

const CreateOrEditCategory = () => {
  /**
   * component states
   */
  const [isEditingCategory, setIsEditingCategory] = useRecoilState(
    isEditingCategoryState
  );
  const setShowCreateOrEditCategory = useSetRecoilState(
    showCreateOrEditCategoryModalState
  );
  const [globalCategory, setGlobalCategory] =
    useRecoilState(globalCategoryState);
  const {
    categoryInputs,
    getCurrentlyAssignedCategoryNames,
    createCategory,
    updateCategory,
    getCategoryEditData,
  } = useCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  /**
   * component functions
   */
  const onSubmit = ({ name, description }) => {
    // validation
    if (
      !isEditingCategory &&
      getCurrentlyAssignedCategoryNames().includes(name)
    ) {
      Notification.errorNotification("The given category name is taken");
      return;
    }

    // when editing
    let categoryEditData = {};
    if (isEditingCategory) {
      categoryEditData = getCategoryEditData(name, description);

      if (Object.keys(categoryEditData).length === 0) {
        setGlobalCategory(null),
          setIsEditingCategory(false),
          Notification.errorNotification("Nothing to edit"),
          setShowCreateOrEditCategory(false);

        return;
      }
    }

    // actual creating or editing of the category
    isEditingCategory
      ? updateCategory(categoryEditData, name, description)
      : createCategory({ name, description });

    setShowCreateOrEditCategory(false);
  };

  /**
   * set the default values when editing
   */
  useEffect(() => {
    if (globalCategory) {
      reset({
        name: globalCategory?.attributes?.name,
        description: globalCategory?.attributes?.description,
      });
    }
  }, [globalCategory]);

  return (
    <section className="space-y-4">
      {/* Header */}
      <ModalHeader
        close={() => {
          setGlobalCategory(null),
            setIsEditingCategory(false),
            setShowCreateOrEditCategory(false);
        }}
        isEditing={isEditingCategory}
        editTitle="Editing Category"
        createTitle="Creating A Category"
      />

      {/* Body */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 px-4 ">
        {categoryInputs.map((categoryInput, categoryInputIndex) => (
          <div key={categoryInputIndex}>
            {categoryInput.component === "Input" ? (
              <div className=" w-full sm:w-1/2">
                <div className="input-group">
                  <input
                    type={categoryInput.type}
                    placeholder=""
                    {...register(categoryInput.name, { required: true })}
                    className="input"
                  />

                  <label className="placeholder border">
                    {categoryInput.label}
                  </label>

                  {errors[categoryInput.name] && (
                    <span className="error">{categoryInput.errorMessage}</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="input-group">
                <textarea
                  type={categoryInput.type}
                  placeholder={categoryInput.placeholder}
                  {...register(categoryInput.name, { required: true })}
                  className="input scrollbar-hide"
                  rows="1"
                />

                <label className="placeholder border">
                  {categoryInput.label}
                </label>

                {errors[categoryInput.name] && (
                  <span className="error">{categoryInput.errorMessage}</span>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end">
          <Button
            icon={<BsSave className="w-5 h-5" />}
            title="Save"
            type="submit"
            buttonStyles="primary_button"
          />
        </div>
      </form>
    </section>
  );
};

export default CreateOrEditCategory;
