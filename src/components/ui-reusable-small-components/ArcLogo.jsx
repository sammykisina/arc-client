import React from "react";
import { Icon } from "../";
import { HiOutlineFire } from "react-icons/hi";

const ArcLogo = ({ isSidebarOpen }) => {
  return (
    <section className="flex gap-x-4 items-center">
      <div
        className={`bg-c_green_light w-10 h-10 rounded-md flex justify-center items-center ${
          isSidebarOpen && "rotate-[360deg]"
        }`}
      >
        <Icon icon={<HiOutlineFire className="w-6 h-6 text-c_green " />} />
      </div>

      <div className="flex items-center gap-x-1">
        <span
          className={`text-xl text-c_green origin-left font-medium duration-300 ${
            !isSidebarOpen && "scale-0"
          }`}
        >
          Arc
        </span>

        <div className="w-2 h-2 bg-c_yellow rounded-full mt-4" />
      </div>
    </section>
  );
};

export default ArcLogo;
