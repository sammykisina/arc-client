import {
  BsClipboardData,
  BsPeople,
  BsChatSquare,
  BsGrid,
} from "react-icons/bs";
import { MdOutlineImportContacts } from "react-icons/md";
import { RiSettingsLine, RiSettings2Line } from "react-icons/ri";
import { GiRoundBottomFlask } from "react-icons/gi";
import { FiHexagon } from "react-icons/fi";
import { ROUTE_PATHS } from "../constants";

export const sidebarRouteLinks = [
  {
    title: "Dashboard",
    route: ROUTE_PATHS.DASHBOARD,
    icon: <BsGrid className="icon" />,
    owner: "admin_super-admin_bartender",
  },
  {
    title: "Bills",
    route: ROUTE_PATHS.BILLS,
    icon: <BsClipboardData className="icon" />,
    owner: "admin_super-admin",
  },
  {
    title: "ARC",
    route: ROUTE_PATHS.ARC,
    icon: <MdOutlineImportContacts className="icon" />,
    owner: "admin_super-admin",
    gap: true,
  },
  {
    title: "Counter",
    route: ROUTE_PATHS.COUNTER,
    icon: <FiHexagon className="icon" />,
    owner: "admin_super-admin_bartender",
  },

  {
    title: "Work Force",
    route: ROUTE_PATHS.WORKFORCE,
    icon: <BsPeople className="icon" />,
    owner: "admin_super-admin",
  },
  {
    title: "Storage",
    route: ROUTE_PATHS.STORAGE,
    icon: <RiSettingsLine className="icon" />,
    owner: "admin_super-admin",
  },
  {
    title: "Messenger",
    route: ROUTE_PATHS.MESSENGER,
    icon: <BsChatSquare className="icon" />,
    owner: "admin_super-admin_bartender",
    gap: true,
  },
  {
    title: "Settings",
    route: "/settings",
    owner: "admin_super-admin_bartender",
    icon: <RiSettings2Line className="icon" />,
  },
];
