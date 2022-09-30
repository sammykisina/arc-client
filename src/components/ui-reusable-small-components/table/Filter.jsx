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
      title={defaultValue}
      options={options}
      selectWrapperStyles="w-[12em] rounded-xl ring-c_gray p-[.3em]"
      selectPanelStyles="ring-c_gray/40 shadow"
      selected={selected}
      setSelected={(option) => setSelected(option)}
    />
  );
};

export default Filter;
