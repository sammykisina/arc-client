import { api } from "./configs/axiosConfigs";
import { defineCancelApiObject } from "./configs/axiosUtils";

export const EmployeeAPI = {
  get: async (uuid, cancel = false) => {
    const response = await api.request({
      url: `/superadmin/employee/${uuid}`,
      method: "GET",

      // retrieving the signal value by using the property name
      signal: cancel
        ? cancelApiObject[get.name].handleRequestCancellation().signal
        : undefined,
    });

    // returning the employee returned from the api
    return response.data;
  },

  getAll: async (cancel = false) => {
    const response = await api.request({
      url: "/superadmin/employee",
      method: "GET",
      signal: cancel
        ? cancelApiObject[get.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },

  create: async (data, cancel = false) => {
    const response = await api.request({
      url: `/superadmin/employee`,
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
      url: `/superadmin/employee/${uuid}`,
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
      url: `/superadmin/employee/${uuid}`,
      method: "DELETE",
      signal: cancel
        ? cancelApiObject[get.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },
};

// defining the cancel API object for EmployeeAPI
const cancelApiObject = defineCancelApiObject(EmployeeAPI);
