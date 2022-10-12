import React, { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { HiX } from "react-icons/hi";
import { Icon, Button } from "..";

const Select = ({
  selected,
  title,
  setSelected,
  options,
  multiple,
  selectWrapperStyles,
  selectPanelStyles,
  selectLabel,
  selectLabelStyles,
}) => {
  /**
   * Component states
   */
  const [isSelectPanelOpen, setIsSelectPanelOpen] = useState(false);

  /**
   * Component functions
   */
  const selectOption = (option) => {
    if (multiple) {
      option?.name
        ? selected.find(
            (singleSelected) =>
              singleSelected?.name?.toLowerCase() ===
              option?.name?.toLowerCase()
          )
          ? setSelected(
              selected.filter(
                (selectedOption) =>
                  selectedOption?.name?.toLowerCase() !=
                  option?.name?.toLowerCase()
              )
            )
          : setSelected([...selected, option])
        : selected.includes(option)
        ? setSelected(
            selected.filter((selectedOption) => selectedOption != option)
          )
        : setSelected([...selected, option]);
    } else {
      if (option != selected) setSelected(option);
    }
  };

  const getClasses = (option) => {
    let bgColor = "";
    if (multiple) {
      selected?.find((selectedElement) => {
        if (
          selectedElement?.name.toLowerCase() === option?.name.toLowerCase()
        ) {
          bgColor = "bg-c_yellow/60 w-fit";
        }
      });
    }

    return bgColor;
  };

  return (
    <section
      tabIndex={0}
      className={`relative min-h-[1.5em] h-fit ring-1 cursor-pointer gap-[.5em] outline-none focus:border-c_yellow rounded-md ${selectWrapperStyles}`}
      onClick={() =>
        setIsSelectPanelOpen(
          (prevIsSelectPanelOpenState) => !prevIsSelectPanelOpenState
        )
      }
      onBlur={() => setIsSelectPanelOpen(false)}
    >
      <div className={`flex items-center gap-1 `}>
        <div className="flex flex-1 gap-1 capitalize text-c_gray text-sm  overflow-x-auto scrollbar-hide">
          {selected
            ? multiple
              ? selected.map((selectedOption, selectedOptionIndex) => (
                  <Button
                    key={selectedOptionIndex}
                    buttonStyles="flex justify-center items-center gap-1 border rounded-full px-1 w-full truncate"
                    title={
                      selectedOption.name ? selectedOption.name : selectedOption
                    }
                    buttonTitleWrapperStyles="capitalize text-sm"
                    icon={<HiX className="w-3 h-3" />}
                    purpose={(event) => {
                      event.stopPropagation();
                      selectOption(selectedOption);
                    }}
                  />
                ))
              : selected.name
              ? selected.name
              : selected
            : title}
        </div>

        <div className="flex items-center">
          <Icon
            icon={<HiX className="w-3 h-3" />}
            purpose={(event) => {
              event.stopPropagation();
              multiple ? setSelected([]) : setSelected("");
            }}
          />

          <div className=" bg-c_dark items-stretch w-[.05rem]" />
          <BiChevronDown
            className={`w-6 h-6 text-c_gray duration-300 ${
              isSelectPanelOpen && "rotate-180"
            }`}
          />
        </div>
      </div>

      <ul
        className={`overflow-y-auto ring-1 rounded-md w-full absolute left-0 top-[calc(100%+.25rem)]
         bg-white z-50 flex flex-col gap-2 scrollbar-hide p-[5px] text-c_gray text-sm
         ${selectPanelStyles} ${isSelectPanelOpen ? "block" : "hidden"}`}
      >
        {options.map((option, optionIndex) => (
          <li
            onClick={(event) => {
              event.stopPropagation();
              selectOption(option);
              setIsSelectPanelOpen(false);
            }}
            key={optionIndex}
            className={`capitalize hover:bg-c_yellow rounded-2xl w-fit px-2 py-1 text-c_dark ${
              option === selected ? "bg-c_yellow/60" : ""
            } ${option?.name && getClasses(option)}`}
          >
            {option?.name ? option?.name : option}
          </li>
        ))}
      </ul>

      {/* label */}
      <label className={`absolute -top-[15px] bg-white  ${selectLabelStyles}`}>
        {selectLabel}
      </label>
    </section>
  );
};

export default Select;
