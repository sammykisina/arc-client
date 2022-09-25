import { api } from "./configs/axiosConfigs";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const TableAPI = {
  getAll: async (cancel = false) => {
    const response = await api.request({
      url: "/admin/tables",
      method: "GET",
      signal: cancel
        ? cancelApiObject[get.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },

  create: async (data, cancel = false) => {
    const response = await api.request({
      url: "/admin/tables",
      method: "POST",
      data: data,
      signal: cancel
        ? cancelApiObject[get.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },

  update: async (uuid, data, cancel = false) => {
    const response = await api.request({
      url: `/admin/tables/${uuid}`,
      method: "PATCH",
      data: data,
      signal: cancel
        ? cancelApiObject[get.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },

  delete: async (uuid, cancel = false) => {
    const response = await api.request({
      url: `/admin/tables/${uuid}`,
      method: "DELETE",
      signal: cancel
        ? cancelApiObject[get.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },
};

// defining the cancel API object for TableAPI
const cancelApiObject = defineCancelApiObject(TableAPI);
