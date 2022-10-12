import { useState } from "react";
import { SuppliersList, Tab } from "../../../";

const Suppliers = () => {
  const [index, setIndex] = useState(0);
  const propertiesTabs = [
    {
      label: "SUPPLIERS",
      content: <SuppliersList />,
    },
    {
      label: "PROCUREMENTS",
      content: "PROCUREMENTS",
    },
  ];

  return (
    <section className="relative">
      <Tab
        tabsData={propertiesTabs}
        labelsOnlyTabs
        labelsOnlyTabsStyles="flex flex-row  mb-4 flex-wrap duration-300 gap-2"
        tabsContentHeight="h-[450px] sm:h-[520px] md:h-[530px] lg:h-[575px]"
        index={index}
        setIndex={setIndex}
      />
    </section>
  );
};

export default Suppliers;
