import React, { useMemo } from "react";

const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id, render },
}) => {
  // calculate the options for filtering
  // using the preFilteredRows
  const options = useMemo(() => {
    const options = new Set();

    preFilteredRows?.forEach((row) => {
      options.add(row.values[id]);
    });

    return [...options.values()];
  }, [id, preFilteredRows]);

  return (
    <label className="flex gap-x-2 items-baseline">
      <span className="text-gray-700">{render("Header")}:</span>

      <select
        className="border border-c_gray px-4 py-2 rounded-xl focus:outline-none text-c_dark cursor-pointer"
        name={id}
        id={id}
        value={filterValue}
        onChange={(event) => {
          setFilter(event.target.value || undefined);
        }}
      >
        <option value="">All</option>
        {options.map((option, optionIndex) => (
          <option className="mt-4 border py-2" key={optionIndex} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};

export default SelectColumnFilter;
