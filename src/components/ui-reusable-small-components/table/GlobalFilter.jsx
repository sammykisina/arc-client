import React, { useState } from "react";
import { Icon } from "../../";
import { RiSearch2Line } from "react-icons/ri";
import { useAsyncDebounce } from "react-table";

const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <label className="flex gap-x-2 items-baseline">
      {/* the search area, only visible  sm and above*/}
      <div className="border border-c_gray rounded-xl flex items-center px-3 gap-x-2 w-[200px]">
        <Icon icon={<RiSearch2Line className="w-5 h-5 text-c_gray" />} />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={`${count} records`}
          className="w-full px-2 py-2  bg-transparent outline-none text-c_dark"
        />
      </div>
    </label>
  );
};

export default GlobalFilter;
