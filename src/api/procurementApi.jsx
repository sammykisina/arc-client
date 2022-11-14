import { API } from "./api";
import { defineCancelApiObject } from "./configs/axiosUtils";

const getCancel = (cancel) =>
  cancel
    ? cancelApiObject[get.name].handleRequestCancellation().signal
    : undefined;

export const ProcurementAPI = {
  getAll: (cancel = false) =>
    API.get("/admin/procurements?include=supplier,item", getCancel(cancel)),

  create: (data, cancel = false) =>
    API.post("/admin/procurements", data, getCancel(cancel)),

  update: (uuid, data, cancel = false) =>
    API.patch(`/admin/procurements/${uuid}`, data, getCancel(cancel)),

  delete: (uuid, cancel = false) =>
    API.delete(`/admin/procurements/${uuid}`, getCancel(cancel)),
};

const cancelApiObject = defineCancelApiObject(ProcurementAPI);
