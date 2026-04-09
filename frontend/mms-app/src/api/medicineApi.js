import API from './axios.js'



// Add token to every request automatically
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const fetchMedicines = () => API.get('/medicines');
export const fetchLowStock = () => API.get('/medicines/low_quantity');
export const fetchNearExpiry = () => API.get('/medicines/expiry');
export const addMedicine = (data) => API.post('/medicines', data);
export const updateMedicine = (id, data) => API.put(`/medicines/${id}`, data);
export const deleteMedicine = (id) => API.delete(`/medicines/${id}`);