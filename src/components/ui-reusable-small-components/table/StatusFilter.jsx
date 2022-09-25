import React from "react";
import { Filter } from "../table";

const StatusFilter = ({ column }) => {
  return <Filter column={column} defaultValue="Status" />;
};

export default StatusFilter;
