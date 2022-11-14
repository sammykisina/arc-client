// react framework imports
import React from "react";

// icon imports {react icons}
import { BiCheckbox, BiCheckboxChecked, BiCircle } from "react-icons/bi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

// recoil imports {recoil and atoms}

// api layer imports

// all components imports {local and packages}
import { Icon } from "../";

const CheckBox = ({
  label,
  checkLabelStyles,
  checkIconsWrapper,
  checkIconStyles,
  isChecked,
  setIsChecked,
}) => {
  // component states

  return (
    <section className="flex items-center gap-x-3">
      <span className={`${checkLabelStyles} text-sm`}>{label}</span>
      <Icon
        iconWrapperStyles={checkIconsWrapper}
        icon={
          isChecked ? (
            <IoMdCheckmarkCircleOutline
              className={`w-5 h-5 ${checkIconStyles}`}
            />
          ) : (
            <BiCircle className={`w-5 h-5 ${checkIconStyles}`} />
          )
        }
        purpose={() =>
          setIsChecked((prevIsCheckedState) => !prevIsCheckedState)
        }
      />
    </section>
  );
};

export default CheckBox;
