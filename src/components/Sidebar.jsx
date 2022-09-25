// react framework imports
import React from "react";
import { useNavigate } from "react-router-dom";

// icon imports {react icons}
import { HiChevronLeft } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";

// recoil imports {recoil and atoms}
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  currentUserRoleState,
  currentUserTokenState,
  isSidebarOpenState,
} from "../atoms/AppAtoms";

// all components imports {local and packages}
import { Icon, SidebarLink, ArcLogo } from ".";
import { sidebarRouteLinks } from "../constants/sidebarRouteLinks";
import { LocalStorage } from "../utils/localStorage";

const Sidebar = () => {
  // component states
  const [isSidebarOpen, setIsSidebarOpen] = useRecoilState(isSidebarOpenState);
  const setCurrentUserToken = useSetRecoilState(currentUserTokenState);
  const [currentUserRole, setCurrentUserRole] =
    useRecoilState(currentUserRoleState);
  const navigate = useNavigate();

  // component functions
  const handleLogout = () => {
    // removing the stored userToken and userRole from the local storage
    LocalStorage.removeStoreItem("authenticatedUserToken");
    LocalStorage.removeStoreItem("authenticatedUserRole");
    // localStorage.removeItem("authenticatedUserToken");

    // set the new values
    setCurrentUserToken("");
    setCurrentUserRole("");

    // redirect to home page after each logout
    navigate("/");
  };

  return (
    <aside
      className={`${
        isSidebarOpen ? "w-[200px]" : "w-24"
      } h-screen relative duration-300 pt-8 p-5 border-r-2 bg-white z-50 flex flex-col justify-between`}
    >
      <Icon
        icon={
          <HiChevronLeft
            className={`w-5 h-5 text-c_green ${!isSidebarOpen && "rotate-180"}`}
          />
        }
        iconWrapperStyles="absolute cursor-pointer -right-[14px] top-[38px] w-7 h-7  rounded-full flex justify-center items-center z-50 bg-c_green_light"
        purpose={() =>
          setIsSidebarOpen((prevIsSidebarOpenState) => !prevIsSidebarOpenState)
        }
      />

      <div>
        {/* the logo */}
        <ArcLogo isSidebarOpen={isSidebarOpen} />

        {/* the links */}
        <ul className="pt-6">
          {sidebarRouteLinks.map((sidebarRouteLink, sidebarRouteLinkIndex) => (
            <SidebarLink
              key={sidebarRouteLinkIndex}
              sidebarRouteLink={sidebarRouteLink}
            />
          ))}
        </ul>
      </div>

      {/* the logout button */}
      <button
        className="bg-c_yellow py-2 rounded-md hover:bg-c_yellow/50 flex  items-center justify-center gap-x-4"
        onClick={handleLogout}
      >
        <FiLogOut
          className={`w-5 h-5 text-white ${isSidebarOpen ? "hidden" : "block"}`}
        />
        <span className={`${!isSidebarOpen ? "hidden" : "block text-white"}`}>
          Logout
        </span>
      </button>
    </aside>
  );
};

export default Sidebar;
