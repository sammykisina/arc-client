// react framework imports
import React from "react";
import { Link, useLocation } from "react-router-dom";

// icon imports {react icons}
import { RiSearch2Line } from "react-icons/ri";
import { IoNotificationsOutline } from "react-icons/io5";
import { HiOutlineMenuAlt3 } from "react-icons/hi";

// recoil imports {recoil and atoms}
import { useSetRecoilState } from "recoil";
import { showSidebarState } from "../atoms/AppAtoms";

// all components imports {local and packages}
import { Icon, Divide, Title, Line, Dropdown, InteractiveButton } from "./";
import { generateAvatar } from "../utils/app";
import { BiBell, BiCart, BiError, BiPackage } from "react-icons/bi";

const TopHeader = () => {
  // component states
  const location = useLocation();
  const setShowSidebar = useSetRecoilState(showSidebarState);

  const notifications = [
    {
      icon: <BiError className="notification-icon" />,
      content: "Curabitur id eros quis nunc suscipit blandit",
    },
    {
      icon: <BiPackage className="notification-icon" />,
      content: "Duis malesuada justo eu sapien elementum",
    },
    {
      icon: <BiCart className="notification-icon" />,
      content: "Donec at nisi sit amet tortor commodo t",
    },
    {
      icon: <BiError className="notification-icon" />,
      content: "In gravida mauris et nisi",
    },
    {
      icon: <BiCart className="notification-icon" />,
      content: "Curabitur id eros quis nunc suscipit blandit",
    },
  ];

  const renderNotificationItem = (notificationItem, notificationItemIndex) => (
    <div className="notification-item  " key={notificationItemIndex}>
      <Icon
        icon={notificationItem.icon}
        iconWrapperStyles="bg-c_green_light w-8 h-8 rounded-lg flex justify-center items-center  col-span-1"
      />
      <span className="text-sm col-span-3 pr-2  -ml-5 sm:ml-0 truncate">
        {notificationItem.content}
      </span>
    </div>
  );

  const UserInfo = () => <div className="h-[50px] w-[200px]">User info</div>;

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
        {/* the notification dropdown */}
        <Dropdown
          icon={<IoNotificationsOutline className="text-[20px] text-c_dark" />}
          badge={notifications.length}
          contentData={notifications}
          renderItems={(item, index) => renderNotificationItem(item, index)}
          renderFooter={() => (
            <Link to="/">
              <InteractiveButton
                title="View All"
                buttonWrapperStyles={`text-center py-2 px-4 bg-c_yellow rounded-md text-white w-fit text-xs uppercase`}
                arrowsPosition="right"
                purpose={() => {}}
              />
            </Link>
          )}
        />

        {/* a divide  line */}
        <Divide divideStyles="-ml-0.5 w-0.5 h-[20px] bg-c_gray" />

        {/* the current user dropdown */}
        <Dropdown
          icon={
            <img
              src={generateAvatar("Angelina Mutua", "abcab9", "2C7A51", true)}
              alt=""
              className="h-6 w-6 rounded-full"
            />
          }
          info={<UserInfo />}
        />
        {/* <div className=" flex-shrink-0 h-6 w-6">
          <img
            src={generateAvatar("Angelina Mutua", "abcab9", "2C7A51", true)}
            alt=""
            className="h-6 w-6 rounded-full"
          />
        </div> */}
      </div>
    </nav>
  );
};

export default TopHeader;
