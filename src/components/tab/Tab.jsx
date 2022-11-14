import { useDeferredValue } from "react";
import { useRecoilValue } from "recoil";
import { Button, Line, ToolTip } from "..";
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
  /**
   * Component states
   */
  const { content } = tabsData[index];
  const cartItems = useRecoilValue(cartItemsState);
  const allOrdersFromDB = useRecoilValue(allOrdersFromDBState);

  /**
   * Component functions
   */
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
      <section className={`${tabsBodyStyles}`}>
        {/* Tab Btns */}
        <section
          className={`duration-300 ${
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
              <div className={`duration-300 `} key={singleTabsDataIndex}>
                <Button
                  title={singleTabsData.label}
                  buttonStyles={`w-fit duration-300 hover:text-c_dark text-sm ${
                    singleTabsDataIndex === index
                      ? "text-c_dark font-semibold tracking-wider"
                      : "text-c_gray"
                  }`}
                  purpose={() => setIndex(singleTabsDataIndex)}
                />

                <Line
                  lineStyles={`duration-300 w-[30px] h-[5px]  rounded-full ${
                    singleTabsDataIndex === index
                      ? "bg-c_yellow"
                      : "bg-c_yellow w-[5px] h-[5px] bg-c_yellow/60"
                  }`}
                />
              </div>
            )
          )}
        </section>

        {/* Tab Info */}
        <section
          className={`col-span-5 overflow-y-scroll duration-300 ${tabsContentHeight}  scrollbar-hide ${
            iconsOnlyTabs && "lg:-ml-4 xl:-ml-10"
          }`}
        >
          {content}
        </section>
      </section>
    </section>
  );
};

export default Tab;
