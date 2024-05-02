import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
// Importing Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Importing Bootstrap JS
import "bootstrap/dist/js/bootstrap.bundle.min";
// Importing Bootstrap Icons
import "bootstrap-icons/font/bootstrap-icons.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
