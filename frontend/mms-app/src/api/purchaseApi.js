
import API from "./axios.js";

// Automatically attach JWT token to every request
// Attach token for the authMiddleware
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

// Add a new purchase and update stock
export const addPurchase = (data) => API.post("/purchase", data);

// Fetch the generated invoice details
export const getInvoice = (purchaseId) => API.get(`/purchases/${purchaseId}/invoice`);

