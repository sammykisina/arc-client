import React from "react";

const NameUuidCell = ({ value, column, row }) => {
  return (
    <section>
      <div className="text-base text-c_dark capitalize">{value}</div>

      <div className="text-sm text-c_gray">
        {row.original[column.uuidAccessor]}
      </div>
    </section>
  );
};

export default NameUuidCell;
