import API from "./axios.js";

export const loginUser = (data) => API.post('/login', data);

