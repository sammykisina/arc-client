import React, { useEffect, useMemo, useState } from "react";
import { Select } from "../..";

const Filter = ({
  defaultValue,
  column: { setFilter, preFilteredRows, id },
}) => {
  // component states
  const [selected, setSelected] = useState("");

  // creating the options for filtering using the perFilteredRows
  const options = useMemo(() => {
    const options = new Set();
    options.add("All");

    preFilteredRows?.forEach((row) => {
      options.add(row.values[id]);
    });

    return [...options.values()];
  }, [id, preFilteredRows]);

  //component functions

  /**
   * set the current filter value
   */
  useEffect(() => {
    setFilter(selected === "All" ? "" : selected);
  }, [selected]);

  return (
    <Select
      options={options}
      title={defaultValue}
      selectWrapperStyles="w-[140px] sm:w-[170px] text-c_dark"
      selectButtonStyles="border rounded-xl text-sm capitalize py-1 px-2"
      selected={selected}
      setSelected={setSelected}
      inputPlaceHolder="Search Filter"
    />
  );
};

export default Filter;
