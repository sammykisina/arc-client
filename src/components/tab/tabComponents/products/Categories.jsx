import React, { useCallback } from "react";
import { useEffect } from "react";
import { HiPlusSm } from "react-icons/hi";
import { Button, SpinnerLoader, Table } from "../../../";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { showCreateOrEditCategoryModalState } from "../../../../atoms/ModalAtom";
import { useCategory } from "../../../../hooks";
import { allCategoriesFromDBState } from "../../../../atoms/CategoryAtom";

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
  const allCategoriesFromDB = useRecoilValue(allCategoriesFromDBState);
  const setShowCreateOrEditCategoryModal = useSetRecoilState(
    showCreateOrEditCategoryModalState
  );

  console.log("allCategoriesFromDB", allCategoriesFromDB);

  /**
   * Component Functions
   */
  useEffect(() => {
    getAllCategoriesFromDB();
  }, []);

  return (
    <section className="h-[440px] border border-transparent sm:h-[520px] lg:h-[565px]  relative">
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

      <div className="absolute top-[5px] right-0 w-fit">
        <Button
          title="Category"
          icon={<HiPlusSm className="w-5 h-5 text-c_white" />}
          buttonStyles="primary_button"
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
