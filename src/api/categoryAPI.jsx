import { API } from "./api";
import { defineCancelApiObject } from "./configs/axiosUtils";

const getCancel = (cancel) =>
  cancel
    ? cancelApiObject[get.name].handleRequestCancellation().signal
    : undefined;

export const CategoryAPI = {
  getAll: async (cancel = false) =>
    await API.get("/executive/categories", getCancel(cancel)),

  create: async (data, cancel = false) =>
    API.post("/admin/category", data, getCancel(cancel)),

  update: async (uuid, data, cancel = false) =>
    API.patch(`/admin/category/${uuid}`, data, getCancel(cancel)),

  delete: async (uuid, cancel = false) =>
    API.delete(`/admin/category/${uuid}`, getCancel(cancel)),
};

// defining the cancel API object for CategoryAPI
const cancelApiObject = defineCancelApiObject(CategoryAPI);
