import API from "./axios.js";

// Fetch all suppliers for the table
export const fetchSuppliers = () => API.get("/supplier");

// Add a new supplier
export const addSupplier = (data) => API.post("/supplier", data);

// Update existing supplier details
export const updateSupplier = (id, data) => API.put(`/supplier/${id}`, data);

// Fetch specific purchase history for a supplier
export const getSupplierTransactions = (id) => API.get(`/supplier/${id}/transactions`);
// Add this to your existing exports
export const getSupplierPurchases = (supplierId) => API.get(`/suppliers/${supplierId}/purchases`);