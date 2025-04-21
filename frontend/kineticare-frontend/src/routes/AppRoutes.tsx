import LoginPage from "../pages/LoginPage";"../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import HomePage from "../pages/HomePage"; // Ruta correcta
import AdminUsuariosPage from "../pages/AdminUsuariosPage";

import { Routes, Route } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/usuarios" element={<AdminUsuariosPage />} />
    </Routes>
    
  );
};

export default AppRoutes;





