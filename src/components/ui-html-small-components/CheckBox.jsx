// react framework imports
import React from "react";

// icon imports {react icons}
import { BiCheckbox, BiCheckboxChecked } from "react-icons/bi";

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
            <BiCheckboxChecked className={`w-8 h-8 ${checkIconStyles}`} />
          ) : (
            <BiCheckbox className={`w-8 h-8 ${checkIconStyles}`} />
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
