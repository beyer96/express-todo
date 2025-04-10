import axios from "axios";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "./utils";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true
});

axiosInstance.interceptors.request.use(config => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
  config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
})

axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.status === 401 || error.status === 403) {
      try {
        const originalRequest = error.config;
        const response = await axiosInstance.post("/auth/token");

        localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, response.data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        // originalRequest._retry = true;

        return axiosInstance(originalRequest);
      } catch {
        localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
      }
    }
  }
);

export default axiosInstance;
