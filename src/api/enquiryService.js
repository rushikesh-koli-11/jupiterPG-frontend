import api from "./axiosConfig";

// Get all enquiries (Admin)
export const getEnquiries = () => api.get("/enquiries");

// Add enquiry (Public – optional, for website form)
export const addEnquiry = (data) => api.post("/enquiries", data);
