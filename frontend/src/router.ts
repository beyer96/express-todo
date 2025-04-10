import { createBrowserRouter } from "react-router";
import DefaultLayout from "./layouts/DefaultLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

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
      }
    ]
  }
]);

export default router;
