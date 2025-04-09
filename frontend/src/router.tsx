import { createBrowserRouter } from "react-router";
import Home from "./components/Home";
import Auth from "./components/Auth";
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
        path: "/auth",
        Component: Auth
      }
    ]
  }
]);

export default router;
