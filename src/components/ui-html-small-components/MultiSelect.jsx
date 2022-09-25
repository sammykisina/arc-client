// react framework imports
import { useRef, useState, useEffect } from "react";

// icon imports {react icons}

// recoil imports {recoil and atoms}

// api layer imports

// all components imports {local and packages}
import { useClickOutside } from "react-haiku";
import { BiChevronDown } from "react-icons/bi";
import { CgClose } from "react-icons/cg";

const MultiSelect = ({
  title,
  selectWrapperStyles,
  selectButtonStyles,
  options,
  setOptions,
  selected,
  setSelected,
  inputPlaceHolder,
}) => {
  // component states
  const [inputValue, setInputValue] = useState("");
  const [isSelectPanelOpen, setIsSelectPanelOpen] = useState(false);
  const optionPanelRef = useRef(null);
  // const [dropDownOptions, setDropDownOptions] = useState(options);

  // component functions
  useClickOutside(optionPanelRef, () => setIsSelectPanelOpen(false));

  return (
    <section
      className={`relative  ${selectWrapperStyles}`}
      ref={optionPanelRef}
    >
      {/* the select button */}
      <div
        onClick={() => setIsSelectPanelOpen(true)}
        className={`${selectButtonStyles} flex flex-row gap-2 items-center  cursor-pointer justify-between h-[30px] mt-1  ${
          selected.length == 0 && "text-c_dark/50"
        }`}
      >
        <div className="flex flex-row gap-1">
          {selected.length > 0
            ? selected.map((selectedOption, selectedOptionIndex) => (
                <span
                  className="bg-c_green_light px-1 py-1 rounded-full flex gap-1 text-sm items-center"
                  key={selectedOptionIndex}
                >
                  {selectedOption.name}
                  <CgClose
                    className={`w-4 h-4 text-c_green`}
                    onClick={() => {
                      setSelected(
                        selected.filter(
                          (singleSelected) =>
                            singleSelected.value != selectedOption.value
                        )
                      );

                      setOptions([...options, selectedOption]);
                    }}
                  />
                </span>
              ))
            : title}
        </div>

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
                  option?.name.toLowerCase().startsWith(inputValue)
                    ? "block"
                    : "hidden"
                }`}
                onClick={() => {
                  setOptions(
                    options.filter(
                      (singleOption) => singleOption.value != option.value
                    )
                  );
                  setSelected([...selected, option]);
                }}
              >
                {option?.name}
              </li>
            );
          })}
        </div>
      </ul>
    </section>
  );
};

export default MultiSelect;
