import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GoPrimeurProductsWithCart from "./components/GoPrimeurProductsWithCart";
import CheckoutPage from "./components/CheckoutPage";
import "../css/app.css";

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GoPrimeurProductsWithCart />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
