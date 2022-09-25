import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BsSave } from "react-icons/bs";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  allCategoriesFromDBState,
  globalCategoryState,
  isCreatingCategoryState,
  isEditingCategoryState,
} from "../../../atoms/CategoryAtom";
import {
  getCategoryData,
  getCurrentAssignedCategoryNames,
} from "../../../utils/category";
import { Notification } from "../../../utils/notifications";
import { Title, Button } from "../../";
import { CategoryAPI } from "../../../api/categoryAPI";
import { showCreateOrEditCategoryModalState } from "../../../atoms/ModalAtoms";

const CreateOrEditCategory = () => {
  // component states
  const [isEditingCategory, setIsEditingCategory] = useRecoilState(
    isEditingCategoryState
  );
  const [allCategoriesFromDB, setAllCategoriesFromDB] = useRecoilState(
    allCategoriesFromDBState
  );
  const setShowCreateOrEditCategory = useSetRecoilState(
    showCreateOrEditCategoryModalState
  );
  const [globalCategory, setGlobalCategory] =
    useRecoilState(globalCategoryState);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  /**
   * category input fields
   */
  const categoryInputs = [
    {
      name: "name",
      label: "Enter Category Name",
      errorMessage: "Enter category name",
      component: "Input",
      type: "text",
    },
    {
      name: "description",
      label: "Enter Category Description",
      errorMessage: "enter category description",
      component: "TextArea",
      type: "text",
    },
  ];

  /**
   * handle submit of category details (either when editing or creating a new one)
   */
  const onSubmit = ({ name, description }) => {
    // validating if the given category name is taken by another category
    if (
      isCreatingCategory &&
      getCurrentAssignedCategoryNames(allCategoriesFromDB).includes(name)
    ) {
      Notification.errorNotification("The given category name is taken");
      return;
    }

    // check if there is new data when editing the data
    const editData = getCategoryData(globalCategory, name, description);

    // don't proceed to edit if there is no data to edit
    if (isEditingCategory && Object.keys(editData).length === 0) {
      setGlobalCategory(null);
      setIsEditingCategory(false);
      Notification.errorNotification("Nothing to edit");
      setShowCreateOrEditCategory(false);
      return;
    }
    // actual creating or editing of the category
    isEditingCategory && globalCategory
      ? CategoryAPI.update(globalCategory?.attributes?.uuid, editData).then(
          (response) => {
            // updating the category
            /**
             * finding the category being edited
             */
            const editedCategory = allCategoriesFromDB.find(
              (categoryFromDB) =>
                categoryFromDB?.attributes?.uuid ===
                globalCategory?.attributes?.uuid
            );

            /**
             * creating a new updated array of the category
             */
            const updatedCategories = allCategoriesFromDB.map(
              (categoryFromDB) =>
                categoryFromDB?.attributes?.uuid ===
                editedCategory?.attributes?.uuid
                  ? {
                      ...editedCategory,
                      attributes: {
                        ...editedCategory?.attributes,
                        name: name,
                        description: description,
                      },
                    }
                  : categoryFromDB
            );

            /**
             * replace the hold data with the new updated data
             */
            setGlobalCategory(null);
            setIsEditingCategory(false);
            setAllCategoriesFromDB(updatedCategories);

            // refresh the browser to remove the updated category  data from the Ui incase of an error
            if (response.error === 1) window.location.reload(false);

            // notifications
            response.error === 1
              ? Notification.errorNotification(response.message)
              : Notification.successNotification(response.message);
          }
        )
      : CategoryAPI.create({
          name: name,
          description: description,
        }).then((response) => {
          if (response.error === 1) {
            Notification.errorNotification(response.message);
          } else {
            // false adding the category to the ui
            setAllCategoriesFromDB([
              ...allCategoriesFromDB,
              {
                ...response?.category,
                attributes: {
                  ...response?.category?.attributes,
                  active: true,
                },
              },
            ]);

            Notification.successNotification(response.message);
          }
        });

    // reset the states
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

                <label className="placeholder">{categoryInput.label}</label>

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
                    className="input"
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
            icon={<BsSave className="w-5 h-5 text-c_dark" />}
            title="Save"
            type="submit"
            buttonStyles="flex items-center gap-x-2 px-2 py-2 bg-c_yellow hover:bg-c_yellow/50 rounded-xl text-c_dark"
            buttonTitleWrapperStyles="hidden sm:block"
          />
        </div>
      </form>
    </section>
  );
};

export default CreateOrEditCategory;
