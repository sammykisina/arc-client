import { useState } from "react";
import { Tab, Tables } from "../components";

const Properties = () => {
  // page states
  const [index, setIndex] = useState(0);
  const propertiesTabs = [
    {
      label: "Tables",
      content: <Tables />,
    },
    {
      label: "Others",
      content: "Others",
    },
  ];
  // page functions
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
