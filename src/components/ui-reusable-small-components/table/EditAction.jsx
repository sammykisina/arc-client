import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { Icon } from "../../";

const EditAction = ({ purpose, iconWrapperStyles }) => {
  return (
    <Icon
      icon={<FiEdit2 className="editActionButton" />}
      purpose={purpose}
      iconWrapperStyles={iconWrapperStyles}
    />
  );
};

export default EditAction;
