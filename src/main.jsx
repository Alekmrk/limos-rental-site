import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";

// Load cookie consent debug utility in development
if (import.meta.env.DEV) {
  import('./utils/cookieConsentDebug.js').catch(err => {
    console.warn('Could not load cookie consent debug utility:', err);
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
