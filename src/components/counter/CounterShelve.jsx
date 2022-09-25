// react framework imports
import { useEffect, useState } from "react";

// recoil imports {recoil and atoms}
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { currentUserWorkIDState } from "../../atoms/AppAtoms";
import {
  allCounterShelvesFromDBState,
  isFetchingCounterShelvesState,
} from "../../atoms/CounterShelveAtom";
// api layer imports
import { CounterShelveAPI } from "../../api/CounterShelve";

// all components imports {local and packages}
import { ActiveCounterShelve, AllCounterShelves, Tab } from "../";

const CounterShelve = () => {
  // component states
  const [allCounterShelvesFromDB, setAllCounterShelvesFromDB] = useRecoilState(
    allCounterShelvesFromDBState
  );
  const currentUserWorkID = useRecoilValue(currentUserWorkIDState);
  const setIsFetchingCounterShelves = useSetRecoilState(
    isFetchingCounterShelvesState
  );
  const allCurrentUserCounterShelves = allCounterShelvesFromDB.filter(
    (counterShelveFromDB) =>
      parseInt(counterShelveFromDB?.attributes?.name) === currentUserWorkID
  );
  const [index, setIndex] = useState(0);
  const counterShelvesData = [
    {
      label: "Active",
      content: (
        <ActiveCounterShelve
          activeCounterShelve={allCurrentUserCounterShelves.find(
            (counterShelveFromDB) =>
              counterShelveFromDB?.relationships?.shift?.attributes?.active ===
              true
          )}
        />
      ),
    },
    {
      label: "All",
      content: (
        <AllCounterShelves
          currentUserShifts={allCurrentUserCounterShelves}
          isFetchingCounterShelves
        />
      ),
    },
  ];

  // component functions
  /**
   * get all the counters
   */
  useEffect(() => {
    setIsFetchingCounterShelves(true);
    CounterShelveAPI.getAll()
      .then((counterShelves) => {
        setAllCounterShelvesFromDB(counterShelves);
      })
      .finally(() => setIsFetchingCounterShelves(false));
  }, []);

  return (
    <section className="">
      <Tab
        tabsData={counterShelvesData}
        labelsOnlyTabs
        labelsOnlyTabsStyles="flex flex-row  mb-4 flex-wrap duration-300 gap-2"
        tabsContentHeight="h-[530px] md:h-[530px] lg:h-[575px]"
        index={index}
        setIndex={setIndex}
      />
    </section>
  );
};

export default CounterShelve;
