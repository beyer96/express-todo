import axiosInstance from "../axios.js";

export const getTasks = async () => {
  const response = await axiosInstance.get("/tasks");

  return response.data;
};