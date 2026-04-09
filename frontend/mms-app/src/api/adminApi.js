import API from "./axios.js";

// User Management
export const fetchUsers = () => API.get('/admin/get-user');
export const addUser = (userData) => API.post('/admin/add-user', userData);
export const updateUserRole = (id, role) => API.put(`/admin/update-role/${id}`, { role });
export const deleteUser = (id) => API.delete(`/admin/delete-user/${id}`);

// Settings
export const fetchSettings = () => API.get('/admin/getsetting');
export const updateSetting = (key, value) => API.put(`/admin/update-setting/${key}`, { value });