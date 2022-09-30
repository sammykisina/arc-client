import React from "react";
import { useEffect } from "react";
import { HiPlus } from "react-icons/hi";
import { showCreateOrEditCategoryModalState } from "../../atoms/ModalAtoms";
import { Button, SpinnerLoader, Table } from "../";
import { useCategory } from "../../hooks";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isSidebarOpenState } from "../../atoms/AppAtoms";

const Categories = () => {
  /**
   * Component states
   */
  const {
    categoriesTableColumns,
    getAllCategoriesFromDB,
    isFetchingCategories,
    getCategoriesDataForCategoriesTable,
  } = useCategory();
  const setShowCreateOrEditCategoryModal = useSetRecoilState(
    showCreateOrEditCategoryModalState
  );
  const isSidebarOpen = useRecoilValue(isSidebarOpenState);

  /**
   * Component Functions
   */
  useEffect(() => {
    getAllCategoriesFromDB();
  }, []);

  return (
    <section className="h-[440px] sm:h-[520px] lg:h-[565px]  relative">
      <div className="mt-2 w-full">
        {isFetchingCategories ? (
          <div className="mt-24">
            <SpinnerLoader color="fill-[#2C7A51]" />
          </div>
        ) : (
          <Table
            columns={categoriesTableColumns}
            data={getCategoriesDataForCategoriesTable()}
            showFilters
            tableHeight={`h-[310px] ${
              isSidebarOpen
                ? "sm:h-[325px] md:h-[377px] lg:h-[453px]"
                : "sm:h-[360px] md:h-[406px] lg:h-[453px]"
            }`}
          />
        )}
      </div>

      <div className="flex justify-end w-full absolute bottom-0">
        <Button
          title="Category"
          icon={<HiPlus className="w-5 h-5 text-c_white" />}
          buttonStyles="primaryButton"
          buttonTitleWrapperStyles="hidden sm:block"
          purpose={() => {
            setShowCreateOrEditCategoryModal(true);
          }}
        />
      </div>
    </section>
  );
};

export default Categories;
