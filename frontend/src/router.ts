import { createBrowserRouter } from "react-router";
import DefaultLayout from "./layouts/DefaultLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Tasks from "./pages/Tasks";
import NewTask from "./pages/NewTask";

const router = createBrowserRouter([
  {
    Component: DefaultLayout,
    children: [
      {
        path: "/",
        Component: Home
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
        Component: Tasks
      },
      {
        path: "/tasks/new",
        Component: NewTask
      }
    ]
  }
]);

export default router;
