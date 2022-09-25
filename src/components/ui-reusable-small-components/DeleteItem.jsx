import React from "react";
import { MdCancel, MdDelete } from "react-icons/md";
import { Title, Button } from "../";

const DeleteItem = ({ title, name, itemDelete, cancelDelete }) => {
  return (
    <section>
      {/* title */}
      <Title title={title} />

      {/* confirmation */}
      <div className="flex justify-center mt-4 text-c_dark">
        <p className="border border-c_gray/20 w-[70%] px-3 py-1 rounded-md flex flex-col gap-y-3">
          {`Are you sure you want to delete the ${name}`}

          <span className="font-semibold text-red-500 text-sm">
            Be aware! This action is not reversible.
          </span>
        </p>
      </div>

      {/* the decision control buttons */}
      <div className="mt-10 flex justify-end gap-x-4">
        <Button
          title="Delete"
          icon={<MdDelete className="w-5 h-5 text-white" />}
          buttonStyles="flex items-center gap-x-2 px-4 py-2 bg-red-500 rounded-xl text-white disabled:bg-c_yellow/10"
          purpose={itemDelete}
        />

        <Button
          title="Cancel"
          icon={<MdCancel className="w-5 h-5 text-white" />}
          buttonStyles="flex items-center gap-x-2 px-4 py-2 bg-c_yellow rounded-xl text-white disabled:bg-c_yellow/10"
          purpose={cancelDelete}
        />
      </div>
    </section>
  );
};

export default DeleteItem;
