import React from "react";
import { Filter } from "../table";

const CategoryFilter = ({ column }) => {
  return <Filter column={column} defaultValue="Categories" />;
};

export default CategoryFilter;
