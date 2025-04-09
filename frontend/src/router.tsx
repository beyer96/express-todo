import { createBrowserRouter } from "react-router";
import Home from "./components/Home";
import Auth from "./components/Auth";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home
  },
  {
    path: "/auth",
    Component: Auth
  }
]);

export default router;
