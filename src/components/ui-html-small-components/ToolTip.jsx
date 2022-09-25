// react framework imports
import React from "react";

// all components imports {local and packages}
// import Tippy from "@tippyjs/react";
import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css";

const ToolTip = ({ component, tipTitle }) => {
  return (
    <Tippy
      render={(attrs) => (
        <div className="toolTipBox" tabIndex="-1" {...attrs}>
          <div className="flex flex-col items-center relative text-sm">
            {tipTitle}
          </div>
        </div>
      )}
    >
      {component}
    </Tippy>
  );
};

export default ToolTip;
