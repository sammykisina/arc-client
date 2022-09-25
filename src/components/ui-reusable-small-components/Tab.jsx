// react framework imports
import React, { useState } from "react";
import { useDeferredValue } from "react";
import { useRecoilValue } from "recoil";

// icon imports {react icons}

// api layer imports

// all components imports {local and packages}
import { Button, Line, ToolTip } from "../";
import { cartItemsState } from "../../atoms/CartAtom";
import { allOrdersFromDBState } from "../../atoms/OrderAtom";

const Tab = ({
  tabsData,
  tabsBodyStyles,
  iconsOnlyTabs,
  iconsOnlyTabsStyles,
  labelsOnlyTabsStyles,
  tabsContentHeight,
  index,
  setIndex,
}) => {
  // component states
  const { content } = tabsData[index];
  const cartItems = useRecoilValue(cartItemsState);
  const allOrdersFromDB = useRecoilValue(allOrdersFromDBState);

  // component functions
  const getBargeValue = (type) => {
    switch (type) {
      case "cartItemsBarge":
        return useDeferredValue(cartItems.length);
      case "ordersBarge":
        return useDeferredValue(allOrdersFromDB.length);

      default:
        "";
    }
  };

  return (
    <section>
      <div className={`${tabsBodyStyles}`}>
        {/* btn container */}
        <div
          className={`${
            iconsOnlyTabs ? iconsOnlyTabsStyles : labelsOnlyTabsStyles
          }`}
        >
          {tabsData.map((singleTabsData, singleTabsDataIndex) =>
            iconsOnlyTabs ? (
              <ToolTip
                key={singleTabsDataIndex}
                component={
                  <Button
                    title={singleTabsData.label}
                    icon={singleTabsData.icon}
                    buttonStyles={`flex items-center gap-x-2 px-6 py-3  rounded-xl text-c_green uppercase text-sm w-fit ${
                      singleTabsDataIndex === index
                        ? "text-c_green bg-c_green_light"
                        : "text-c_dark border"
                    }`}
                    buttonTitleWrapperStyles={`hidden`}
                    purpose={() => setIndex(singleTabsDataIndex)}
                    barge={
                      singleTabsData.barge
                        ? getBargeValue(singleTabsData.barge)
                        : ""
                    }
                  />
                }
                tipTitle={singleTabsData.label}
              />
            ) : (
              <div className={`duration-300`} key={singleTabsDataIndex}>
                <Button
                  title={singleTabsData.label}
                  buttonTitleWrapperStyles={`tracking-wider`}
                  buttonStyles={`w-fit duration-300  ${
                    singleTabsDataIndex === index
                      ? "text-c_dark font-semibold"
                      : "text-c_dark"
                  }`}
                  purpose={() => setIndex(singleTabsDataIndex)}
                />

                <Line
                  lineStyles={`${
                    singleTabsDataIndex === index
                      ? "bg-c_yellow block"
                      : "hidden"
                  }  w-[30px] h-[5px] rounded-full`}
                />
              </div>
            )
          )}
        </div>

        {/* tabs info*/}
        <article
          className={`col-span-5 overflow-y-scroll ${tabsContentHeight}  scrollbar-hide ${
            iconsOnlyTabs && "lg:-ml-4 xl:-ml-10"
          }`}
        >
          {content}
        </article>
      </div>
    </section>
  );
};

export default Tab;
