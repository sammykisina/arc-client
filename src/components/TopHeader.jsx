// react framework imports
import React from "react";
import { useLocation } from "react-router-dom";

// icon imports {react icons}
import { RiSearch2Line } from "react-icons/ri";
import { IoNotificationsOutline } from "react-icons/io5";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

// recoil imports {recoil and atoms}
import { useSetRecoilState } from "recoil";
import { showSidebarState } from "../atoms/AppAtoms";

// all components imports {local and packages}
import { Icon, Divide, Title, Line } from "./";
import { generateAvatar } from "../utils/app";

const TopHeader = () => {
  // component states
  const location = useLocation();
  const setShowSidebar = useSetRecoilState(showSidebarState);

  return (
    <nav className="h-[50px] flex items-center justify-between">
      <div className="flex items-center gap-x-4">
        <Icon
          icon={
            <HiOutlineMenuAlt3 className="w-5 h-5 text-c_green sm:hidden" />
          }
          purpose={() => setShowSidebar((prevShowSidebar) => !prevShowSidebar)}
        />
        {/* the current page title */}
        <div>
          <Title
            title={
              location.pathname === "/"
                ? "Dashboard"
                : location.pathname.substring(1)
            }
            titleStyles="capitalize text-c_dark text-xl font-semibold tracking-wider"
          />
          <Line lineStyles="bg-c_green w-[30px] h-[5px] rounded-full" />
        </div>
      </div>

      {/* the rest of the icons */}
      <div className="flex items-center  gap-x-4 divide-c_gray text-c_gray">
        {/* the notification icon */}
        <Icon icon={<IoNotificationsOutline className="w-6 h-6" />} />

        {/* a divide  line */}
        <Divide divideStyles="-ml-0.5 w-0.5 h-[20px] bg-c_gray" />

        {/* the current user profile icon */}
        <div className=" flex-shrink-0 h-6 w-6">
          <img
            src={generateAvatar("Angelina Mutua", "abcab9", "2C7A51", true)}
            alt=""
            className="h-6 w-6 rounded-full"
          />
        </div>
      </div>
    </nav>
  );
};

export default TopHeader;
