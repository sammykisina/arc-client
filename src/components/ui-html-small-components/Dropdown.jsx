import React, { useRef } from "react";
import { Icon } from "../";

const clickOutsideRef = (content_ref, toggle_ref) => {
  document.addEventListener("mousedown", (event) => {
    // user clicks toggle btn
    if (toggle_ref.current && toggle_ref.current.contains(event.target)) {
      content_ref.current.classList.toggle("active");
    } else {
      // user clicks outside toggle and content
      if (content_ref.current && !content_ref.current.contains(event.target)) {
        content_ref.current.classList.remove("active");
      }
    }
  });
};

const Dropdown = ({
  icon,
  badge,
  customToggle,
  renderFooter,
  contentData,
  renderItems,
  info,
}) => {
  /**
   * Component states
   */
  const dropdown_toggle_el = useRef(null);
  const dropdown__content_el = useRef(null);

  /**
   * Component functions
   */
  clickOutsideRef(dropdown__content_el, dropdown_toggle_el);

  return (
    <div className="relative z-50">
      <button ref={dropdown_toggle_el} className="relative">
        {icon ? <Icon icon={icon} /> : ""}
        {badge ? (
          <span className="dropdown__toggle-badge flex justify-center items-center absolute -top-[14px] -right-[10px] h-[20px] w-[20px] rounded-full bg-c_yellow text-white text-xs">
            {badge}
          </span>
        ) : (
          ""
        )}
        {customToggle ? customToggle() : ""}
      </button>

      <div
        ref={dropdown__content_el}
        className={`dropdown__content absolute px-[2px] py-[10px] top-[calc(100%+5px)] right-0 w-max max-w-[250px]  sm:max-w-[400px] bg-white shadow-md rounded-xl overflow-hidden border`}
      >
        {contentData && renderItems
          ? contentData.map((item, index) => renderItems(item, index))
          : info}

        {renderFooter ? (
          <div className="p-[20px] text-center">{renderFooter()}</div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Dropdown;
