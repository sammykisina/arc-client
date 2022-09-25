import { api } from "./configs/axiosConfigs";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const CounterShelveAPI = {
  getAll: async (cancel = false) => {
    const response = await api.request({
      url: "/bartender/counters?include=items,shift",
      method: "GET",
      signal: cancel
        ? cancelApiObject[get.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },
};

// defining the cancel API object for CounterShelveAPI
const cancelApiObject = defineCancelApiObject(CounterShelveAPI);
