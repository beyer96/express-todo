import axiosInstance from "../axios.js";
import { Task } from "../store/tasksSlice.js";

export default class TasksService {
  static async getTasks() {
    const response = await axiosInstance.get("/tasks");

    return response.data;
  }

  static async updateTask(taskId: number, data: Partial<Task>) {
    const response = await axiosInstance.put(`/tasks/${taskId}`, data);

    return response.data;
  }

  static async removeTask(taskId: number) {
    await axiosInstance.delete(`/tasks/${taskId}`);
  }
}
