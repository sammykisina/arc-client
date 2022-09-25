// react framework imports
import { useState, useRef } from "react";
import { BiChevronDown } from "react-icons/bi";
import { useClickOutside } from "react-haiku";

const Select = ({
  title,
  selectWrapperStyles,
  selectButtonStyles,
  options,
  selected,
  setSelected,
  inputPlaceHolder,
}) => {
  // component states
  const [inputValue, setInputValue] = useState("");
  const [isSelectPanelOpen, setIsSelectPanelOpen] = useState(false);
  const optionPanelRef = useRef(null);

  // component functions
  useClickOutside(optionPanelRef, () => setIsSelectPanelOpen(false));

  return (
    <section
      className={`relative  ${selectWrapperStyles}`}
      ref={optionPanelRef}
    >
      {/* the select button */}
      <div
        onClick={() =>
          setIsSelectPanelOpen(
            (prevIsSelectPanelOpenState) => !prevIsSelectPanelOpenState
          )
        }
        className={`${selectButtonStyles} flex justify-between items-center  cursor-pointer 
          ${!selected ? "text-c_dark/50" : "text-c_dark"}`}
      >
        {selected
          ? selected.name?.length > 25 || selected > 25
            ? selected.name?.substring(0, 25) ||
              selected.substring(0, 25) + "..."
            : selected.name || selected
          : title}
        <BiChevronDown
          className={`w-6 h-6 text-c_green duration-300 ${
            isSelectPanelOpen && "rotate-180"
          }`}
        />
      </div>

      {/* select items */}
      <ul
        className={`absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1.5 text-base border overflow-auto focus:outline-none sm:text-sm capitalize text-c_dark duration-300 px-2 scrollbar-hide ${
          isSelectPanelOpen ? "max-h-60" : "hidden"
        }`}
      >
        {/* the search input */}
        <div className="flex items-center  sticky top-0 bg-white mb-3 border rounded-lg gap-2 w-full py-1 px-2">
          <input
            type="text"
            value={inputValue}
            onChange={(event) =>
              setInputValue(event.target.value.toLowerCase())
            }
            placeholder={inputPlaceHolder}
            className="placeholder:text-c_gray outline-none rounded-md text-base w-full"
          />
        </div>

        <div className="flex flex-col gap-y-2 px-2">
          {options?.map((option, optionIndex) => {
            return (
              <li
                key={optionIndex}
                className={`p-2 text-sm hover:bg-c_green_light text-c_green rounded-md cursor-pointer ${
                  option?.name
                    ? option?.name === selected.name && "bg-c_green_light"
                    : option === selected && "bg-c_green_light"
                } ${
                  option?.name
                    ? option?.name.toLowerCase().startsWith(inputValue)
                      ? "block"
                      : "hidden"
                    : option.toLowerCase().startsWith(inputValue)
                    ? "block"
                    : "hidden"
                } `}
                onClick={() => {
                  if (option?.name != selected?.name || option != selected) {
                    setSelected(option);
                    setIsSelectPanelOpen(false);
                    setInputValue("");
                  }
                }}
              >
                {option?.name ? option?.name : option}
              </li>
            );
          })}
        </div>
      </ul>
    </section>
  );
};

export default Select;
