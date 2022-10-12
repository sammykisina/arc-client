// react framework imports
import { useState } from "react";

// icon imports {react icons}
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";

// all components imports {local and packages}
import { Icon } from "../";

const InteractiveButton = ({
  title,
  buttonWrapperStyles,
  purpose,
  arrowsPosition,
  defaultIcon,
  hoverIcon,
}) => {
  /**
   * component states
   */
  const [buttonHovered, setButtonHovered] = useState(false);

  /**
   * component function
   */
  const onButtonHover = () => {
    setButtonHovered(!buttonHovered);
  };

  return (
    <button
      onMouseEnter={onButtonHover}
      onMouseLeave={onButtonHover}
      onClick={() => purpose()}
      className={`${buttonWrapperStyles}  py-2 px-4 items-center gap-3 cursor-pointer`}
    >
      {arrowsPosition === "right" ? (
        <div className="flex justify-between items-center">
          <span>{title}</span>
          <Icon
            icon={buttonHovered ? hoverIcon : defaultIcon}
            iconWrapperStyles="ml-[8px] text-xl duration-300"
          />
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <Icon
            icon={buttonHovered ? hoverIcon : defaultIcon}
            iconWrapperStyles="mr-[8px] text-xl duration-300"
          />

          <span>{title}</span>
        </div>
      )}
    </button>
  );
};

export default InteractiveButton;
