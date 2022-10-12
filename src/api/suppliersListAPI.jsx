import { api } from "./configs/axiosConfigs";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const SuppliersListsAPI = {
  getAll: async (cancel = false) => {
    const response = await api.request({
      url: "/admin/suppliers?include=variants.product,products",
      signal: cancel
        ? cancelApiObject[get.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },

  create: async (data, cancel = false) => {
    const response = await api.request({
      url: "/admin/suppliers",
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
      url: `/admin/suppliers/${uuid}`,
      method: "PATCH",
      data: data,
      signal: cancel
        ? cancelApiObject[get.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },

  delete: async (data, cancel = false) => {
    const response = await api.request({
      url: `/admin/suppliers`,
      method: "DELETE",
      data: data,
      signal: cancel
        ? cancelApiObject[get.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },
};

const cancelApiObject = defineCancelApiObject(SuppliersListsAPI);
