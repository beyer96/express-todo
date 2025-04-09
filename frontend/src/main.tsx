import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./stylesheets/index.scss";
import { RouterProvider } from "react-router";
import router from "./router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)