// react framework imports
import { useEffect } from "react";

// icon imports {react icons}
import { AiOutlineDollar, AiOutlineUsergroupAdd } from "react-icons/ai";
import { IoCubeOutline } from "react-icons/io5";
import { BiChevronDown } from "react-icons/bi";

// recoil imports {recoil and atoms}
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isSidebarOpenState } from "../atoms/AppAtoms";
import { allEmployeesFromDBState } from "../atoms/EmployeeAtom";

// all components imports {local and packages}
import { Icon, Title, DashboardIntoCard, Line } from "../components";
import { EmployeeAPI } from "../api/employeeAPI";

const Dashboard = () => {
  // page states
  const isSidebarOpen = useRecoilValue(isSidebarOpenState);
  const setAllEmployeesFromDB = useSetRecoilState(allEmployeesFromDBState);

  // page functions

  return (
    <section>
      {/* the title */}
      <div className="flex justify-between">
        <div>
          <Title title="Overview" titleStyles="text-sm text-c_dark" />
          <Line lineStyles="bg-c_yellow/100 w-[25px] h-[2px]" />
        </div>

        <div className="border rounded-md w-[110px] h-[30px] flex items-center px-2 gap-1">
          <Title title="This week" titleStyles="text-sm text-c_dark" />

          <Icon icon={<BiChevronDown className="w-5 h-5" />} />
        </div>
      </div>

      {/* the rest of the body */}
      <div className="mt-5">
        {/* the overview displays  {Sales,Unit Sales,New Employee } */}
        <div
          className={`flex justify-center flex-col sm:grid  gap-2  md:grid-cols-3  items-center ${
            isSidebarOpen ? "md:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"
          }`}
        >
          {/* the sales */}
          <DashboardIntoCard
            icon={<AiOutlineDollar className="w-6 h-6 text-c_green" />}
            title="Sales"
            value="82,750"
            money
          />

          {/* the unit sales */}
          <DashboardIntoCard
            icon={<IoCubeOutline className="w-6 h-6 text-c_green" />}
            title="Sales"
            value="1,012"
          />

          {/* the unit sales */}
          <DashboardIntoCard
            icon={<AiOutlineUsergroupAdd className="w-6 h-6 text-c_green" />}
            title="Employees"
            value="20"
          />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
