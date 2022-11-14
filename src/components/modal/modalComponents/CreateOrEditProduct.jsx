import { useRecoilState, useSetRecoilState } from "recoil";
import {
  globalProductState,
  isEditingProductState,
} from "../../../atoms/ProductAtom";
import { Tab, Dependent, Independent, ModalHeader } from "../../";
import { createProductDecisionTabsIndexState } from "../../../atoms/AppAtoms";
import { showCreateOrEditProductState } from "../../../atoms/ModalAtom";

const CreateOrEditProduct = () => {
  /**
   * Component states
   */
  const [isEditingProduct, setIsEditingProduct] = useRecoilState(
    isEditingProductState
  );
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
  const setGlobalProduct = useSetRecoilState(globalProductState);
  const setCreateOrEditProductModal = useSetRecoilState(
    showCreateOrEditProductState
  );

  return (
    <section className="space-y-3">
      <ModalHeader
        close={() => {
          setGlobalProduct(null),
            setIsEditingProduct(false),
            setCreateOrEditProductModal(false);
        }}
        isEditing={isEditingProduct}
        editTitle="Editing Product"
        createTitle="Creating A Product"
      />

      <div className="px-1">
        <Tab
          tabsData={productTypeDecisionTabs}
          labelsOnlyTabs
          labelsOnlyTabsStyles="flex flex-row  mb-4 flex-wrap duration-300 gap-2"
          tabsContentHeight="h-[450px] sm:h-[530px] md:h-[530px] lg:h-[575px]"
          index={createProductDecisionTabsIndex}
          setIndex={
            isEditingProduct ? () => {} : setCreateProductDecisionTabsIndex
          }
        />
      </div>
    </section>
  );
};

export default CreateOrEditProduct;
