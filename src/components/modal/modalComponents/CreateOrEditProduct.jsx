import { useRecoilState, useRecoilValue } from "recoil";
import { isEditingProductState } from "../../../atoms/ProductAtom";
import { Title, Tab, Dependent, Independent } from "../../";
import { createProductDecisionTabsIndexState } from "../../../atoms/AppAtoms";

const CreateOrEditProduct = () => {
  /**
   * Component states
   */
  const isEditingProduct = useRecoilValue(isEditingProductState);
  const [createProductDecisionTabsIndex, setCreateProductDecisionTabsIndex] =
    useRecoilState(createProductDecisionTabsIndexState);
  const productTypeDecisionTabs = [
    {
      label: "INDEPENDENT",
      content: <Independent />,
    },
    {
      label: "DEPENDENT",
      content: <Dependent />,
    },
  ];

  return (
    <section className="relative h-full">
      <Title title={isEditingProduct ? "Edit Product." : "Create Product."} />

      <div className="mt-2">
        <Tab
          tabsData={productTypeDecisionTabs}
          labelsOnlyTabs
          labelsOnlyTabsStyles="flex flex-row  mb-4 flex-wrap duration-300 gap-2"
          tabsContentHeight="h-[450px] sm:h-[530px] md:h-[530px] lg:h-[575px]"
          index={createProductDecisionTabsIndex}
          setIndex={setCreateProductDecisionTabsIndex}
        />
      </div>
    </section>
  );
};

export default CreateOrEditProduct;
