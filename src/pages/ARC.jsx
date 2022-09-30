// react framework imports
import React from "react";

// icon imports {react icons}
import { IoCubeOutline } from "react-icons/io5";
import { TiSpannerOutline } from "react-icons/ti";
import { FaBuromobelexperte } from "react-icons/fa";
import { RiBringForward } from "react-icons/ri";

// all components imports {local and packages}
import { Tab } from "../components";
import { Products, Properties, Suppliers } from "../components";
import { useState } from "react";

const ARC = () => {
  // page states
  const [index, setIndex] = useState(0);
  const data = [
    {
      label: "Inventory",
      icon: <IoCubeOutline className="icon" />,
      content: <Products />,
    },
    {
      label: "Properties",
      icon: <TiSpannerOutline className="icon" />,
      content: <Properties />,
    },

    {
      label: "Expenses",
      icon: <FaBuromobelexperte className="icon" />,
      content: `We're not always in the position that we want to be at.
      We're constantly growing. We're constantly making mistakes. We're 
      constantly trying to express ourselves and actualize our dreams.`,
    },

    {
      label: "Suppliers",
      icon: <RiBringForward className="icon" />,
      content: <Suppliers />,
    },
  ];
  return (
    <section>
      <Tab
        tabsData={data}
        tabsBodyStyles="lg:grid grid-cols-6"
        iconsOnlyTabs
        index={index}
        setIndex={setIndex}
        iconsOnlyTabsStyles="flex flex-row mb-2 flex-wrap duration-300 lg:flex-col gap-2 col-span-1"
        tabsContentHeight="h-[505px] sm:h-[580px] md:h-[580px] lg:h-[630px]"
      />
    </section>
  );
};

export default ARC;
