import { api } from "./configs/axiosConfigs";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const OrderAPI = {
  getAll: async (cancel = false) => {
    const response = await api.request({
      url: "/bartender/orders?include=items",
      method: "GET",
      signal: cancel
        ? cancelApiObject[get.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },
  create: async (data, cancel = false) => {
    const response = await api.request({
      url: "",
      method: "POST",
      data: data,
      signal: cancel
        ? cancelApiObject[get.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },
};

// defining the cancel API object for OrderAPI
const cancelApiObject = defineCancelApiObject(OrderAPI);
