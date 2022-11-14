import axios from "axios";
import { Notification } from "../../utils/notifications";

export const api = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization:
      `Bearer ` + JSON.parse(localStorage.getItem("authenticatedUserToken")),
  },
  baseURL: "http://127.0.0.1:8000/api/v1",
});

// defining a custom error handler for all APIs
const errorHandler = (error) => {
  const statusCode = error.response?.status;

  // logging only errors that are not 401
  if (statusCode && statusCode !== 401) {
    Notification.errorNotification(error.response.data.message);
    console.log(error);
  }

  return Promise.reject(error);
};

// registering the custom error handler to the "api" axios instance
api.interceptors.response.use(undefined, (error) => {
  return errorHandler(error);
});
