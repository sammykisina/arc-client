import { useState } from "react";
import { Tab, Tables } from "../";

const Properties = () => {
  /**
   * Component states
   */
  const [index, setIndex] = useState(0);
  const propertiesTabs = [
    {
      label: "TABLES",
      content: <Tables />,
    },
    {
      label: "OTHERS",
      content: "Others",
    },
  ];

  return (
    <section>
      <Tab
        tabsData={propertiesTabs}
        labelsOnlyTabs
        labelsOnlyTabsStyles="flex flex-row  mb-4 flex-wrap duration-300 gap-2"
        tabsContentHeight="h-[530px] md:h-[530px] lg:h-[575px]"
        index={index}
        setIndex={setIndex}
      />
    </section>
  );
};

export default Properties;
