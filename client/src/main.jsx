import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { LanguageProvider } from "./context/LanguageContext";
import "leaflet/dist/leaflet.css";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </LanguageProvider>
  </React.StrictMode>
);