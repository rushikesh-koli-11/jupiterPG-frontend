import api from "./axiosConfig";

export const getEnquiries = () => api.get("/enquiries");

export const addEnquiry = (data) => api.post("/enquiries", data);
