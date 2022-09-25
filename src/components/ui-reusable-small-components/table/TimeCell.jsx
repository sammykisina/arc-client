import React from "react";

const TimeCell = ({ value, column, row }) => {
  return (
    <section>
      <div className="text-sm font-semibold text-c_dark capitalize">
        {value}
      </div>

      <div className="text-sm text-c_gray">
        {row.original[column.timeAccessor]}
      </div>
    </section>
  );
};

export default TimeCell;
