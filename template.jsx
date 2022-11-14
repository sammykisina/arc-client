<Select
  title=""
  options={["box", "crate", "singles", "pack"]}
  selectWrapperStyles={`w-full rounded-md ring-c_gray  py-2 px-2`}
  selectPanelStyles="ring-c_gray/40 shadow h-[90px]"
  selected={selectedFrom}
  setSelected={(option) => setSelectedFrom(option)}
  selectLabel="Select The Item Form."
  selectLabelStyles="border text-c_dark/50 rounded-full px-1"
/>;
