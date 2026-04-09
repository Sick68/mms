import API from "./axios.js";


API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});


// Ensure these paths match the prefix in server.js
export const getDailyReport = (date) => API.get("/report/daily?date=" + date);
export const getMonthlyReport = (month, year) => API.get(`/report/monthly?month=${month}&year=${year}`);
export const getStockReport = () => API.get("/report/stock");
export const getExpiryReport = () => API.get("/report/expiry");