import { api } from "./configs/axiosConfigs";

export const API = {
  get: async (url, signal) => {
    const response = await api.request({
      url: url,
      method: "GET",
      signal: signal,
    });

    return response.data;
  },

  post: async (url, data, signal) => {
    const response = await api.request({
      url: url,
      method: "POST",
      data: data,
      signal: signal,
    });

    return response.data;
  },

  patch: async (url, data, signal) => {
    const response = await api.request({
      url: url,
      method: "PATCH",
      data: data,
      signal: signal,
    });

    return response.data;
  },

  delete: async (url, data = [], signal) => {
    const response = await api.request({
      url: url,
      method: "DELETE",
      data: data,
      signal: signal,
    });

    return response.data;
  },
};
