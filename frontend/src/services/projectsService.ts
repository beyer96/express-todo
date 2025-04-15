import axiosInstance from "../axios.js";
import { Project } from "../store/projectsSlice.js";

export default class ProjectsService {
  static async getProjects() {
    const response = await axiosInstance.get("/projects");

    return response.data;
  }

  static async createProject(project: Project) {
    const response = await axiosInstance.post("/project", project);

    return response.data;
  }

  static async updateProject(projectId: number, data: Partial<Project>) {
    const response = await axiosInstance.put(`/projects/${projectId}`, data);

    return response.data;
  }

  static async removeProject(projectId: number) {
    await axiosInstance.delete(`/projects/${projectId}`);
  }
}
