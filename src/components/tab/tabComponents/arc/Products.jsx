import { useState } from "react";
import { Categories, ProductsAndVariants, Tab } from "../../../";

const Product = () => {
  /**
   * the pages tabs
   */

  const [index, setIndex] = useState(0);
  const productPageTabs = [
    {
      label: "CATEGORIES",
      content: <Categories />,
    },
    {
      label: "PRODUCTS",
      content: <ProductsAndVariants />,
    },
  ];

  /**
   * the official render of the page
   */
  return (
    <Tab
      tabsData={productPageTabs}
      labelsOnlyTabs
      labelsOnlyTabsStyles="flex flex-row  mb-4 flex-wrap duration-300 gap-2"
      tabsContentHeight="h-[450px] sm:h-[530px] md:h-[530px] lg:h-[575px]"
      index={index}
      setIndex={setIndex}
    />
  );
};

export default Product;
