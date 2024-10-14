import axios from 'axios';

// Determine the base URL based on the environment
const BASE_URL = import.meta.env.MODE === "development" ? 'http://localhost:5000/api' : '/api';

export const axiosInstance = axios.create({
    baseURL: BASE_URL,  // Use `baseURL` instead of `BASE_URL`
    withCredentials: true,
});
