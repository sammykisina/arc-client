import React from "react";
import { Icon, Title } from "../";
import { isSidebarOpenState } from "../../atoms/AppAtoms";
import { useRecoilValue } from "recoil";

const DashboardIntoCard = ({ icon, title, value, money = false }) => {
  // components states
  const isSidebarOpen = useRecoilValue(isSidebarOpenState);

  return (
    <div
      className={`border w-[250px]  h-[80px] rounded-3xl border-c_gray grid grid-cols-5 items-center  gap-x-4 duration-300 ${
        isSidebarOpen
          ? "md:w-[180px] lg:w-[210px]"
          : "sm:w-[220px] md:w-[180px] lg:w-[250px]"
      }`}
    >
      <div className="col-span-2 flex justify-end">
        <Icon
          icon={icon}
          iconWrapperStyles="bg-c_green_light w-10 h-10 rounded-lg flex justify-center items-center "
        />
      </div>

      <div className="flex flex-col col-span-3">
        <Title title={title} titleStyles="text-sm text-c_gray" />
        <Title
          title={money ? `Ksh.` + value : value}
          titleStyles="text-lg text-c_dark "
        />
      </div>
    </div>
  );
};

export default DashboardIntoCard;
