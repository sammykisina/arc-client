import { useState } from "react";
import { useMemo } from "react";
import { MdDelete } from "react-icons/md";
import { RiEditCircleFill } from "react-icons/ri";
import { useRecoilState, useSetRecoilState } from "recoil";
import { CategoryAPI } from "../api/categoryAPI";
import {
  allCategoriesFromDBState,
  globalCategoryState,
  isEditingCategoryState,
} from "../atoms/CategoryAtom";
import {
  showCreateOrEditCategoryModalState,
  showDeleteCategoryModalState,
} from "../atoms/ModalAtoms";
import { Icon } from "../components";
import { NameUuidCell } from "../components/ui-reusable-small-components/table";
import { Notification } from "../utils/notifications";

const useCategory = () => {
  /**
   * Hook states
   */
  const [allCategoriesFromDB, setAllCategoriesFromDB] = useRecoilState(
    allCategoriesFromDBState
  );
  const setIsEditingCategory = useSetRecoilState(isEditingCategoryState);
  const setShowDeleteCategoryModal = useSetRecoilState(
    showDeleteCategoryModalState
  );
  const [globalCategory, setGlobalCategory] =
    useRecoilState(globalCategoryState);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);
  const setShowCreateOrEditCategoryModal = useSetRecoilState(
    showCreateOrEditCategoryModalState
  );

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

  const categoriesTableColumns = useMemo(
    () => [
      {
        Header: "Product Categories",
        columns: [
          {
            Header: "Name",
            accessor: "name",
          },
          {
            Header: "Description",
            accessor: "description",
          },
          {
            Header: "Actions",
            accessor: "actions",
          },
        ],
      },
    ],
    []
  );

  /**
   * Hooks functions
   */
  const getCurrentlyAssignedCategoryNames = () => {
    const categoriesNames = new Set();

    allCategoriesFromDB?.forEach((categoryFromDB) => {
      categoriesNames.add(categoryFromDB?.attributes?.name);
    });

    return [...categoriesNames.values()];
  };

  const createCategory = (categoryData) => {
    CategoryAPI.create(categoryData).then((response) => {
      if (response.error === 1)
        Notification.errorNotification(response.message);
      else
        setAllCategoriesFromDB([response.category, ...allCategoriesFromDB]),
          Notification.successNotification(response.message);
    });
  };

  const updateCategory = (editCategoryData, name, description) => {
    CategoryAPI.update(globalCategory?.attributes?.uuid, editCategoryData).then(
      (response) => {
        if (response.error === 1)
          Notification.errorNotification(response.message);
        else {
          const categoryBeingEdited = allCategoriesFromDB.find(
            (categoryFromDB) =>
              globalCategory?.attributes?.uuid ===
              categoryFromDB?.attributes?.uuid
          );

          const newUpdatedCategories = allCategoriesFromDB.map(
            (categoryFromDB) =>
              categoryFromDB?.attributes?.uuid ===
              categoryBeingEdited?.attributes?.uuid
                ? {
                    ...categoryBeingEdited,
                    attributes: {
                      ...categoryBeingEdited?.attributes,
                      name,
                      description,
                    },
                  }
                : categoryFromDB
          );

          setAllCategoriesFromDB(newUpdatedCategories);
          Notification.successNotification(response.message);
        }

        setIsEditingCategory(false);
        setGlobalCategory(null);
      }
    );
  };

  const deleteCategory = () => {
    CategoryAPI.delete(globalCategory?.attributes?.uuid).then((response) => {
      if (response.error) Notification.errorNotification(response.message);
      else {
        const newCategories = allCategoriesFromDB.filter(
          (categoryFromDB) =>
            categoryFromDB?.attributes?.uuid != globalCategory?.attributes?.uuid
        );

        setAllCategoriesFromDB(newCategories);
        Notification.successNotification(response.message);
      }
    });
  };

  const getCategoryEditData = (name, description) => {
    let categoryEditData = {};

    if (globalCategory?.attributes?.name != name)
      categoryEditData = { ...categoryEditData, name };

    if (globalCategory?.attributes?.description != description)
      categoryEditData = { ...categoryEditData, description };

    return categoryEditData;
  };

  const getAllCategoriesFromDB = () => {
    setIsFetchingCategories(true);
    CategoryAPI.getAll()
      .then((categories) => setAllCategoriesFromDB(categories))
      .finally(() => setIsFetchingCategories(false));
  };

  const getCategoriesDataForCategoriesTable = () => {
    let categoriesData = [];

    allCategoriesFromDB?.forEach((categoryFromDB) => {
      categoriesData = [
        ...categoriesData,
        {
          uuid: categoryFromDB?.attributes?.uuid,
          name: categoryFromDB?.attributes?.name,
          description: categoryFromDB?.attributes?.description,
          actions: [
            <div
              className="flex gap-x-3"
              key={categoryFromDB?.attributes?.uuid}
            >
              <Icon
                icon={<MdDelete className="deleteActionButton" />}
                purpose={() => {
                  setGlobalCategory(categoryFromDB);
                  setShowDeleteCategoryModal(true);
                }}
              />
              <Icon
                icon={<RiEditCircleFill className="editActionButton" />}
                purpose={() => {
                  setGlobalCategory(categoryFromDB),
                    setShowCreateOrEditCategoryModal(true);
                }}
              />
            </div>,
          ],
        },
      ];
    });

    return categoriesData;
  };

  const generateCategoryOptions = useMemo(() => {
    const categoryOptions = new Set();

    allCategoriesFromDB?.forEach((categoryFromDB) => {
      categoryOptions.add({
        name: categoryFromDB?.attributes?.name,
        value: categoryFromDB?.id,
      });
    });

    return [...categoryOptions.values()];
  }, [allCategoriesFromDB]);

  return {
    categoryInputs,
    getCurrentlyAssignedCategoryNames,
    createCategory,
    updateCategory,
    getCategoryEditData,
    categoriesTableColumns,
    getAllCategoriesFromDB,
    isFetchingCategories,
    getCategoriesDataForCategoriesTable,
    deleteCategory,
    generateCategoryOptions,
  };
};

export default useCategory;
