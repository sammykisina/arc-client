import { useState } from "react";
import { Employees, Payroll, Tab } from "../components";

const WorkForce = () => {
  /**
   * Component states
   */
  const [index, setIndex] = useState(0);
  const workforceTabs = [
    {
      label: "EMPLOYEES",
      content: <Employees />,
    },
    {
      label: "PAYROLL",
      content: <Payroll />,
    },
  ];

  return (
    <section>
      <Tab
        tabsData={workforceTabs}
        labelsOnlyTabs
        labelsOnlyTabsStyles="flex flex-row  mb-4 flex-wrap duration-300 gap-2"
        tabsContentHeight="h-fit"
        index={index}
        setIndex={setIndex}
      />
    </section>
  );
};

export default WorkForce;
