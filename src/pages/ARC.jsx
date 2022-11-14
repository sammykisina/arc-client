import { useCallback, useState } from "react";
import { useEffect } from "react";
import { IoCubeOutline } from "react-icons/io5";
import { TiSpannerOutline } from "react-icons/ti";
import { FaBuromobelexperte } from "react-icons/fa";
import { RiBringForward } from "react-icons/ri";
import {
  Tab,
  Products,
  Properties,
  Suppliers_Procurements_Tokens,
} from "../components";
import { useProduct, useProductVariant, useSupplier } from "../hooks";

const ARC = () => {
  // page states
  const [index, setIndex] = useState(0);
  const { getAllSuppliersFromDB } = useSupplier();
  const { getAllProductsFromDB } = useProduct();
  const { getAllProductVariantsFromDB } = useProductVariant();
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
      label: "Suppliers-Procurements-Tokens",
      icon: <RiBringForward className="icon" />,
      content: <Suppliers_Procurements_Tokens />,
    },
  ];

  // get some global need data
  // useEffect(() => {

  // }, []);
  // useCallback(() => {
  //   Promise.all([
  //     getAllProductsFromDB(),
  //     getAllProductVariantsFromDB(),
  //     getAllSuppliersFromDB(),
  //   ]);
  // }, []);

  return (
    <section>
      <Tab
        tabsData={data}
        tabsBodyStyles="lg:grid grid-cols-6 duration-300"
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
