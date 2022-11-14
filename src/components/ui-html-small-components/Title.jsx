import React from "react";

const Title = ({ title, titleStyles }) => {
  return (
    <h2
      className={`text-sm leading-tight tracking-wider font-semibold text-shadow ${
        titleStyles ? titleStyles : "text-sm text-c_dark leading-tight mb-1"
      }`}
    >
      {title}
    </h2>
  );
};

export default Title;
