import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { IconContext } from "react-icons/lib";

import "./stylesheets/index.scss";
import router from "./router";
import store from "./store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <IconContext.Provider value={{ className: "react-icon" }}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </IconContext.Provider>
  </StrictMode>
)