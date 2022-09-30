import React from "react";
import { Filter } from "../table";

const LocationFilter = ({ column }) => {
  return <Filter column={column} defaultValue="Location" />;
};

export default LocationFilter;
