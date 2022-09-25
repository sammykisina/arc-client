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
        notificationWrapperStyles={`bg-white border shadow-md px-4 py-2 rounded-full ${notificationColor}`}
      />
    ),
    {
      position: "top-right",
    }
  );
};

// export const Notification = {
//   // store a value with the given key
//   error: (title) => getNotified(title, "text-red-500"),

//   // get the store item with the given key
//   // getStoreValue: (key) => JSON.parse(localStorage.getItem(key)),

//   // // delete the item with the given key
//   // removeStoreItem: (key) => localStorage.removeItem(key),
// };
