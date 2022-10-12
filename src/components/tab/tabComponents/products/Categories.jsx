import React from "react";
import { useEffect } from "react";
import { HiPlusSm } from "react-icons/hi";
import { Button, SpinnerLoader, Table } from "../../../";
import { useSetRecoilState } from "recoil";
import { showCreateOrEditCategoryModalState } from "../../../../atoms/ModalAtoms";
import { useCategory } from "../../../../hooks";

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

  /**
   * Component Functions
   */
  useEffect(() => {
    getAllCategoriesFromDB();
  }, []);

  return (
    <section className="h-[440px] sm:h-[520px] lg:h-[565px]  relative">
      <div className="mt-2 w-full border border-transparent">
        {isFetchingCategories ? (
          <div className="mt-24 ">
            <SpinnerLoader color="fill-[#2C7A51]" />
          </div>
        ) : (
          <Table
            columns={categoriesTableColumns}
            data={getCategoriesDataForCategoriesTable()}
            showFilters
            tableHeight={`h-[370px] sm:h-[450px] md:h-[460px] lg:h-[505px]`}
          />
        )}
      </div>

      <div className="flex justify-end absolute top-[6px] right-0 w-fit">
        <Button
          title="Category"
          icon={<HiPlusSm className="w-5 h-5 text-c_white" />}
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
