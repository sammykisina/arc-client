const Modal = ({ modalState, modalStyles, component }) => {
  return (
    <section
      className={`${modalState ? "modal-wrapper show " : "modal-wrapper"} `}
    >
      <div className={`modal ${modalStyles} py-5 flex flex-col gap-y-4`}>
        {component}
      </div>
    </section>
  );
};

export default Modal;
