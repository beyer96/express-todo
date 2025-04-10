import axiosInstance from "../axios";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "../utils";

export const restoreUserSession = async () => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
  if (accessToken) {
    const response = await axiosInstance.get("/auth/session", {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    return response.data.user;
  } else {
    return await refreshToken();
  }
};

export const refreshToken = async () => {
  const response = await axiosInstance.post("/auth/token");
  const { user, accessToken } = response.data;

  if (accessToken) {
    localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, accessToken);
  }
  
  return user;
};
