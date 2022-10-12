import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BsSave } from "react-icons/bs";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  globalCategoryState,
  isEditingCategoryState,
} from "../../../atoms/CategoryAtom";
import { Notification } from "../../../utils/notifications";
import { Title, Button, Line } from "../../";
import { showCreateOrEditCategoryModalState } from "../../../atoms/ModalAtoms";
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
    <section className="relative  h-full">
      <Title title={isEditingCategory ? "Edit Category" : "Create Category"} />
      <Line lineStyles="bg-c_yellow/100 w-[25px] h-[5px] rounded-full" />

      {/* fields */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
        {categoryInputs.map((categoryInput, categoryInputIndex) => (
          <div key={categoryInputIndex}>
            {categoryInput.component === "Input" ? (
              <div className="input-group w-[250px] sm:w-[220px] md:w-[240px]">
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
            ) : (
              <div className="py-4">
                <div className="input-group w-full">
                  <textarea
                    type={categoryInput.type}
                    placeholder={categoryInput.placeholder}
                    {...register(categoryInput.name, { required: true })}
                    className="input scrollbar-hide"
                    rows="3"
                  />

                  <label className="placeholder">{categoryInput.label}</label>

                  {errors[categoryInput.name] && (
                    <span className="error">{categoryInput.errorMessage}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="mt-[30px] sm:mt-10 flex justify-end  absolute -bottom-[10px] w-fit right-0">
          <Button
            icon={<BsSave className="w-5 h-5 text-white" />}
            title="Save"
            type="submit"
            buttonStyles="flex items-center gap-x-2 px-2 py-2 bg-c_yellow hover:bg-c_yellow/50 rounded-xl text-white"
            buttonTitleWrapperStyles="hidden sm:block"
          />
        </div>
      </form>
    </section>
  );
};

export default CreateOrEditCategory;
