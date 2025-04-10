import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
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
