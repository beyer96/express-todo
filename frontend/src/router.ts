import { createBrowserRouter } from "react-router";
import Home from "./components/Home";
import Login from "./components/Login";
import DefaultLayout from "./layouts/DefaultLayout";

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
      }
    ]
  }
]);

export default router;
