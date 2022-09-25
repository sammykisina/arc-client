import React from "react";

const Notify = ({ t, title, notificationWrapperStyles }) => {
  return (
    <section
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } ${notificationWrapperStyles}`}
    >
      <span className="text-sm">{title}</span>
    </section>
  );
};

export default Notify;
