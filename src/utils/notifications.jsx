import toast from "react-hot-toast";
import { Notify } from "../components";

export const Notification = {
  // error notification
  errorNotification: (title) => getNotified(title, "text-red-500"),

  // success notification
  successNotification: (title) => getNotified(title, "text-c_green"),
};

const getNotified = (title, notificationColor) => {
  toast.custom(
    (t) => (
      <Notify
        t={t}
        title={title}
        notificationWrapperStyles={`bg-white shadow-md px-4 py-2 rounded-full ${notificationColor}`}
      />
    ),
    {
      position: "top-right",
    }
  );
};
