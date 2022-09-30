import React from "react";
import { generateAvatar } from "../../../utils/app";

const AvatarCell = ({ value, column, row }) => {
  return (
    <section className="flex items-center">
      <div className=" flex-shrink-0 h-7 w-7">
        <img
          src={generateAvatar(value, "abcab9", "2C7A51", true)}
          alt=""
          className="h-full w-full rounded-full"
        />
      </div>

      <div className="ml-4">
        <div className="text-xs font-semibold text-c_dark capitalize">
          {value}
        </div>

        <div className="text-sm text-c_gray">
          {row.original[column.emailAccessor]}
        </div>
      </div>
    </section>
  );
};

export default AvatarCell;
