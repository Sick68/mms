import API from './axios.js';



API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const createSale = (saleData) => API.post('/sales', saleData);
export const getMedicinesForSale = () => API.get('/medicines'); // To populate dropdown
export const getAllCustomers = () => API.get("/customers");
