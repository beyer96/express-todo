import { createBrowserRouter } from "react-router";
import DefaultLayout from "./layouts/DefaultLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Tasks from "./pages/Tasks";
import NewTask from "./pages/NewTask";
import TasksService from "./services/tasksService";
import ProjectsService from "./services/projectsService";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "./utils";

const router = createBrowserRouter([
  {
    Component: DefaultLayout,
    children: [
      {
        path: "/",
        Component: Home,
        loader: async () => {
          if (!localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)) return { tasks: undefined, projects: undefined };

          const tasks = await TasksService.getTasks();
          const projects = await ProjectsService.getProjects();

          return { tasks, projects };
        }
      },
      {
        path: "/login",
        Component: Login
      },
      {
        path: "/signup",
        Component: Signup
      },
      {
        path: "/tasks",
        Component: Tasks,
        loader: async () => {
          if (!localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)) return { tasks: undefined };

          const tasks = await TasksService.getTasks();

          return { tasks };
        }
      },
      {
        path: "/tasks/new",
        Component: NewTask
      }
    ]
  }
]);

export default router;
