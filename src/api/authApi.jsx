import { api } from "./configs/axiosConfigs";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const AuthAPI = {
  // login in the user
  login: async (credentials, cancel = false) => {
    const response = await api.request({
      url: `/auth/login`,
      method: "POST",
      data: credentials,
      signal: cancel
        ? cancelApiObject[get.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },
};

// defining the cancel API object for AuthAPI
const cancelApiObject = defineCancelApiObject(AuthAPI);
