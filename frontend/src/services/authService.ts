import axiosInstance from "../axios";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "../utils";

export interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
}

export const restoreUserSession = async () => {
  try {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
    const response = await axiosInstance.get("/auth/session", {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    if (response.status === 200) return response.data.user;
  } catch {
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

export const registerNewUser = async (userData: UserData) => {
  const response = await axiosInstance.post("/auth/signup", userData);
  const { user, accessToken } = response.data;
  if (!user || !accessToken) throw new Error("Missing data in response");

  localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, accessToken);

  return user;
};
