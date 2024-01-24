import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import WorkerProvider from "./workers/WorkerProvider.jsx";
import { AccountProvider } from "./contexts/account.js";
import { GlobalProvider } from "./contexts/global.js";
import { RouterProvider } from "react-router-dom";
import { router } from "./routing.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalProvider>
      <AccountProvider>
        <WorkerProvider>
          <RouterProvider router={router} />
        </WorkerProvider>
      </AccountProvider>
    </GlobalProvider>
  </React.StrictMode>,
);
