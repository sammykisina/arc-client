import { API } from "./api";
import { defineCancelApiObject } from "./configs/axiosUtils";

const getCancel = (cancel) =>
  cancel
    ? cancelApiObject[get.name].handleRequestCancellation().signal
    : undefined;

export const AuthAPI = {
  login: async (data, cancel = false) =>
    API.post("/auth/login", data, getCancel(cancel)),
};

// defining the cancel API object for AuthAPI
const cancelApiObject = defineCancelApiObject(AuthAPI);
