import { API } from "./api";
import { api } from "./configs/axiosConfigs";
import { defineCancelApiObject } from "./configs/axiosUtils";

const getCancel = (cancel) =>
  cancel
    ? cancelApiObject[get.name].handleRequestCancellation().signal
    : undefined;

export const SupplierAPI = {
  getAll: async (cancel = false) =>
    API.get(
      "/admin/suppliers?include=variants.product,products",
      getCancel(cancel)
    ),

  create: async (data, cancel = false) =>
    API.post("/admin/suppliers", data, getCancel(cancel)),

  update: async (uuid, data, cancel = false) =>
    API.patch(`/admin/suppliers/${uuid}`, data, getCancel(cancel)),

  delete: async (data, cancel = false) =>
    API.delete("/admin/suppliers", data, getCancel(cancel)),
};

const cancelApiObject = defineCancelApiObject(SupplierAPI);
