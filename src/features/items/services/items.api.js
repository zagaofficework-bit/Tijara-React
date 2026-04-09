import apiClient from "../../../api/apiClient";

export const fetchItems = async (params = {}) => {
  const query = new URLSearchParams();
  Object.keys(params).forEach((k) => params[k] && query.set(k, params[k]));
  const res = await apiClient.get(`/api/get-item?${query.toString()}`);
  return res.data;
};

export const fetchCategories = async () => {
  const res = await apiClient.get("/api/get-category");
  return res.data;
};