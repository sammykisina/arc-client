import { api } from "./configs/axiosConfigs";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const ShiftAPI = {
  getAll: async (cancel = false) => {
    const response = await api.request({
      url: "/admin/shifts?include=workers.role",
      method: "GET",
      signal: cancel
        ? cancelApiObject[get.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },

  create: async (data, cancel = false) => {
    const response = await api.request({
      url: "/admin/shifts",
      method: "POST",
      data: data,
      signal: cancel
        ? cancelApiObject[get.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },
};

// defining the cancel API object for ShiftAPI
const cancelApiObject = defineCancelApiObject(ShiftAPI);
