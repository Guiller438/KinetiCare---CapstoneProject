import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import HomePage from "../pages/HomePage"; 
import AdminUsuariosPage from "../pages/AdminUsuariosPage";
import NoAutorizado from "../pages/NoAutorizado";
import EvaluacionPage from "../pages/MenuEvaluacion";
import NuevaEvaluacionPage from "../pages/NuevaEvaluacionPage";
import TomaDeDatos from "../pages/TomaDeDatosClinicosPage";

import ProtectedRoute from "../components/ProtectedRoute";

import { Routes, Route } from "react-router-dom";
import NuevoPacientePage from "../pages/nuevoPacientePage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/no-autorizado" element={<NoAutorizado />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/menuevaluacion" element={<EvaluacionPage />} />
      <Route path="/evaluaciones/nueva" element={<NuevaEvaluacionPage />} />
      <Route path="/evaluaciones/crearPaciente" element={<NuevoPacientePage />} />
      <Route path="/tomaDatosClinicos" element={<TomaDeDatos />} />

      {/* Rutas de error */}

      {/* Rutas protegidas */}
{/*      <Route 
        path="/home" 
        element={
          <ProtectedRoute rolesPermitidos={["Administrador", "Fisioterapeuta"]}>
            <HomePage />
          </ProtectedRoute>
        } 
      />
*/}
      <Route 
        path="/usuarios" 
        element={
          <ProtectedRoute rolesPermitidos={["Administrador"]}>
            <AdminUsuariosPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
