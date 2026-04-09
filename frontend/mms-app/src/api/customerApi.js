
import API from "./axios.js";

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const addCustomer = (data) => API.post("/customer", data);
export const getCustomerHistory = (id) => API.get(`/customers/${id}`);
export const getAllCustomers = () => API.get("/customers");