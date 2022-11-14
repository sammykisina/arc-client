import { CgClose } from "react-icons/cg";
import { Icon } from "../";

const ModalClose = ({ close }) => {
  return (
    <Icon
      icon={<CgClose className={`w-5 h-5 text-c_green`} />}
      purpose={close}
      iconWrapperStyles="p-1 w-fit h-fit  rounded-full flex justify-center items-center z-50 bg-c_green_light"
    />
  );
};

export default ModalClose;
