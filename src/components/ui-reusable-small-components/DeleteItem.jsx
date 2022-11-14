import React from "react";
import { FiTrash } from "react-icons/fi";
import { MdCancel, MdDelete } from "react-icons/md";
import { Title, Button, ModalClose } from "../";

const DeleteItem = ({ title, name, itemDelete, close }) => {
  return (
    <section className="px-4">
      <ModalClose close={close} />

      {/* confirmation */}
      <div className="flex justify-center mt-4 text-c_dark">
        <p className="border border-c_gray/20 text-sm w-fit px-3 py-1 rounded-md flex flex-col gap-y-3">
          {`Are you sure you want to delete the ${name}?`}

          <span className="font-semibold text-red-500 text-sm">
            Be aware! This action is not reversible.
          </span>
        </p>
      </div>

      {/* the decision control buttons */}
      <div className="mt-10 flex justify-end gap-x-4">
        <Button
          title="Delete"
          icon={<FiTrash className="w-5 h-5" />}
          buttonStyles="delete_primary_button"
          purpose={itemDelete}
        />
      </div>
    </section>
  );
};

export default DeleteItem;
