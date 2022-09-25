import React from "react";
import { useRecoilValue } from "recoil";
import { currentUserRoleState, isSidebarOpenState } from "../../atoms/AppAtoms";
import { Icon } from "../";
import { Link, useLocation } from "react-router-dom";

const SidebarLink = ({ sidebarRouteLink }) => {
  // components states
  const isSidebarOpen = useRecoilValue(isSidebarOpenState);
  const location = useLocation();
  const currentUserRole = useRecoilValue(currentUserRoleState);

  return (
    <Link
      to={sidebarRouteLink.route}
      className={`${
        currentUserRole === "bartender" &&
        sidebarRouteLink.owner === "admin_super-admin"
          ? "hidden"
          : "block"
      }`}
    >
      <li
        className={`
          flex items-center gap-x-4 cursor-pointer p-2 hover:text-c_green rounded-md tracking-wider text-sm 
          ${
            location.pathname === sidebarRouteLink.route
              ? " text-c_green bg-c_green_light"
              : "text-c_gray"
          } 
          ${!isSidebarOpen && "justify-center"}  
          ${sidebarRouteLink.gap ? "mt-9" : "mt-2"}`}
      >
        <Icon icon={sidebarRouteLink.icon} />
        <span
          className={`${!isSidebarOpen && "hidden"} origin-left duration-200`}
        >
          {sidebarRouteLink.title}
        </span>
      </li>
    </Link>
  );
};

export default SidebarLink;
