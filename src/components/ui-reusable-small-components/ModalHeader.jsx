import React from "react";
import { ModalClose, Title } from "../";

const ModalHeader = ({ close, createTitle, editTitle, isEditing, title }) => {
  return (
    <section className="space-y-2  py-1 px-4 border-b border-c_gray/50">
      <ModalClose close={close} />

      <Title
        title={isEditing ? editTitle : createTitle}
        titleStyles="text-c_dark uppercase"
      />
    </section>
  );
};

export default ModalHeader;
