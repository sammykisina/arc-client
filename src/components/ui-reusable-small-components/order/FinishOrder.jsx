// recoil imports {recoil and atoms}
import { useSetRecoilState } from "recoil";
import { counterTabsIndexState } from "../../../atoms/TabAtom";

// all components imports {local and packages}
import { InteractiveButton } from "../../";

const FinishOrder = () => {
  // component states
  const setCounterTabsIndex = useSetRecoilState(counterTabsIndexState);

  return (
    <section className="flex  gap-4 justify-center">
      <InteractiveButton
        title="Serve Another"
        buttonWrapperStyles="text-center py-2 px-4 bg-c_yellow rounded-full text-white w-fit text-sm"
        arrowsPosition="left"
        purpose={() => setCounterTabsIndex(0)}
      />

      <InteractiveButton
        title="View Order"
        buttonWrapperStyles="text-center py-2 px-4 bg-c_yellow rounded-full text-white w-fit text-sm"
        arrowsPosition="right"
        purpose={() => setCounterTabsIndex(2)}
      />
    </section>
  );
};

export default FinishOrder;
