import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import CheckoutPage from "../pages/CheckoutPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
    </Routes>
  );
};

export default AppRoutes;