import { FiTrash } from "react-icons/fi";
import { Icon } from "../../";

const DeleteAction = ({ purpose }) => {
  return (
    <Icon
      icon={<FiTrash className="deleteActionButton " />}
      purpose={purpose}
    />
  );
};

export default DeleteAction;
