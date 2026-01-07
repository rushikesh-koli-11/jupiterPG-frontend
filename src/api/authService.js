import api from "./axiosConfig";

export const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  localStorage.setItem("token", res.data);
  return res.data;
};

export const register = async (data) => {
  return api.post("/auth/register", data);
};
