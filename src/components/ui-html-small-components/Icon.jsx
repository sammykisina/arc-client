import React from "react";

const Icon = ({ icon, iconWrapperStyles, purpose = () => {} }) => {
  return (
    <div className={`${iconWrapperStyles} cursor-pointer`} onClick={purpose}>
      {icon}
    </div>
  );
};

export default Icon;
