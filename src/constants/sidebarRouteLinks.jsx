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

export const sidebarRouteLinks = [
  {
    title: "Dashboard",
    route: "/",
    icon: <BsGrid className="icon" />,
    owner: "admin_super-admin_bartender",
  },
  {
    title: "Bills",
    route: "/bills",
    icon: <BsClipboardData className="icon" />,
    owner: "admin_super-admin",
  },
  {
    title: "ARC",
    route: "/arc",
    icon: <MdOutlineImportContacts className="icon" />,
    owner: "admin_super-admin",
    gap: true,
  },
  {
    title: "Counter",
    route: "/counter",
    icon: <FiHexagon className="icon" />,
    owner: "admin_super-admin_bartender",
  },

  {
    title: "Employees",
    route: "/employee",
    icon: <BsPeople className="icon" />,
    owner: "admin_super-admin",
  },
  {
    title: "Storage",
    route: "/storage",
    icon: <RiSettingsLine className="icon" />,
    owner: "admin_super-admin",
  },
  {
    title: "Message",
    route: "/message",
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
