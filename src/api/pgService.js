import api from "./axiosConfig";

export const getPgs = () => api.get("/pgs");
export const addPg = (formData) =>
  api.post("/pgs", formData); 
export const updatePg = (id, data) => api.put(`/pgs/${id}`, data);
export const deletePg = (id) => api.delete(`/pgs/${id}`);

export const getRoomsByPg = (pgId) => api.get(`/rooms/pg/${pgId}`);
export const addRoom = (data) => api.post("/rooms", data);
export const updateRoom = (id, data) => api.put(`/rooms/${id}`, data);
export const deleteRoom = (id) => api.delete(`/rooms/${id}`);

export const getBedsByRoom = (roomId) =>
  api.get(`/beds/room/${roomId}`);

export const getResidents = () => api.get("/residents");
export const addResident = (data) => api.post("/residents", data);
export const updateResident = (id, data) =>
  api.put(`/residents/${id}`, data);
export const deleteResident = (id) =>
  api.delete(`/residents/${id}`);

export const getDashboardStats = () =>
  api.get("/dashboard/stats");

export const sendEnquiry = (data) =>
  api.post("/enquiries", data);
