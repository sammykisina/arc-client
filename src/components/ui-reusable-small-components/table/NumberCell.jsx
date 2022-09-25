import React from "react";
import { generateNumberWithCommas } from "../../../utils/app";

const NumberCell = ({ value, column, row }) => {
  return (
    <span className={` text-c_dark text-sm`}>
      {row.original.form === "dependent"
        ? "_"
        : column.Header === "Measure"
        ? value + `ml`
        : generateNumberWithCommas(value)}
    </span>
  );
};

export default NumberCell;
