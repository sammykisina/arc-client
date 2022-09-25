import React from "react";

const Title = ({ title, titleStyles }) => {
  return (
    <h2
      className={`${
        titleStyles
          ? titleStyles
          : "text-sm text-c_dark leading-tight tracking-wider font-semibold text-shadow"
      }`}
    >
      {title}
    </h2>
  );
};

export default Title;
