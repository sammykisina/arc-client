// react framework imports
import React, { useMemo } from "react";

import { MdOutlineCountertops, MdPublishedWithChanges } from "react-icons/md";

// icon imports {react icons}
import { TbTiltShift } from "react-icons/tb";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaOpencart } from "react-icons/fa";

// recoil imports {recoil and atoms}
import { useRecoilState, useRecoilValue } from "recoil";
import { currentUserRoleState } from "../atoms/AppAtoms";
import { counterTabsIndexState } from "../atoms/TabAtom";

// all components imports {local and packages}
import { Shift, CounterShelve, Cart, Orders, Tab } from "../components";
import { LocalStorage } from "../utils/localStorage";

const Counter = () => {
  // page states
  const currentUserRole = useRecoilValue(currentUserRoleState);
  const [counterTabsIndex, setCounterTabsIndex] = useRecoilState(
    counterTabsIndexState
  );
  const counterTabs = [
    {
      label: "Shift",
      icon: <TbTiltShift className="icon" />,
      content: <Shift />,
      owner: "admin_superadmin",
    },
    {
      label: "Counter Shelves",
      icon: <MdOutlineCountertops className="icon" />,
      content: <CounterShelve />,
      owner: "bartender",
    },
    {
      label: "Cart",
      icon: <AiOutlineShoppingCart className="icon" />,
      content: <Cart />,
      owner: "bartender",
      barge: "cartItemsBarge",
    },
    {
      label: "Orders",
      icon: <FaOpencart className="icon" />,
      content: <Orders />,
      owner: "bartender",
      barge: "ordersBarge",
    },
    {
      label: "Shelve",
      icon: <MdPublishedWithChanges className="icon" />,
      content: <Orders />,
      owner: "admin_superadmin",
    },
    {
      label: "Sales",
      icon: <FaOpencart className="icon" />,
      content: <Orders />,
      owner: "admin_superadmin",
    },
  ];

  const getCounterTabsBasedOnRole = useMemo(() => {
    const barTenderTabs = counterTabs.filter(
      (counterTab) => counterTab.owner === "bartender"
    );
    const admin_superadminTabs = counterTabs.filter(
      (counterTab) => counterTab.owner === "admin_superadmin"
    );

    return currentUserRole === "bartender"
      ? barTenderTabs
      : currentUserRole === "admin" || currentUserRole === "super-admin"
      ? admin_superadminTabs
      : [];
  }, []);

  const handleSetIndex = (index) => {
    setCounterTabsIndex(index);
    LocalStorage.storeValue("counterTabsCurrentIndex", index);
  };

  return (
    <section className="">
      <Tab
        tabsData={getCounterTabsBasedOnRole}
        index={counterTabsIndex}
        setIndex={(index) => handleSetIndex(index)}
        tabsBodyStyles="lg:grid grid-cols-6"
        iconsOnlyTabs
        iconsOnlyTabsStyles="flex flex-row mb-2 flex-wrap duration-300 lg:flex-col gap-2 col-span-1"
        tabsContentHeight="h-[580px] md:h-[580px] lg:h-[630px]"
      />
    </section>
  );
};

export default Counter;
