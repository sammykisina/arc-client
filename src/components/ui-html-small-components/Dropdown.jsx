import React, { useRef } from "react";

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
  singleMessageTextBoxWrapperRef,
}) => {
  //* states
  const dropdown_toggle_el = useRef(null);
  const dropdown__content_el = useRef(null);

  //* functions
  clickOutsideRef(dropdown__content_el, dropdown_toggle_el);

  return (
    <div>
      <button ref={dropdown_toggle_el} className="">
        {icon ? icon : ""}
        {badge ? <span className="dropdown__toggle-badge">{badge}</span> : ""}
        {customToggle ? customToggle() : ""}
      </button>

      <div
        ref={dropdown__content_el}
        className={`${
          singleMessageTextBoxWrapperRef?.current?.clientWidth < 100
            ? "dropdown__content origin-top-left left-3/4 rounded-r-2xl rounded-br-md rounded-bl-2xl"
            : "dropdown__content origin-top-right rounded-l-2xl rounded-br-md rounded-bl-2xl right-0"
        }  w-[170px] p-2 border border-gray-300 bg-[#fff]`}
      >
        {contentData && renderItems
          ? contentData.map((item, index) => renderItems(item, index))
          : ""}

        {renderFooter ? (
          <div className="dropdown__footer">{renderFooter()}</div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Dropdown;
