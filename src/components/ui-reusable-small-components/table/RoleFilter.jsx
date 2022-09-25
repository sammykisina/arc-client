import React from "react";
import { Filter } from "../table";

const RoleFilter = ({ column }) => {
  return <Filter column={column} defaultValue="Role" />;
};

export default RoleFilter;
