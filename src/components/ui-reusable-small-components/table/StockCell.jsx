import React from "react";

const StockCell = ({ value, row }) => {
  return (
    <span
      className={`${
        row.original.form === "dependent"
          ? "text-sm py-1 px-3 w-5 h-5"
          : "text-sm py-1 px-3 w-5 h-5 uppercase leading-loose"
      } `}
    >
      {row.original.form === "dependent" ? "_" : value}
    </span>
  );
};

export default StockCell;
