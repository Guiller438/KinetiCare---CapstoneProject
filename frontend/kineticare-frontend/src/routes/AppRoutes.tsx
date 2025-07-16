import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import NoAutorizado from "../pages/NoAutorizado";
import HomePage from "../pages/HomePage";
import AdminUsuariosPage from "../pages/AdminUsuariosPage";
import EvaluacionPage from "../pages/MenuEvaluacion";
import NuevaEvaluacionPage from "../pages/NuevaEvaluacionPage";
import NuevoPacientePage from "../pages/nuevoPacientePage";
import TomaDeDatos from "../pages/TomaDeDatosClinicosPage";
import SeguimientoPage from "../pages/SeguimientoPage";
import DisponibilidadPage from "../pages/DisponibilidadPage";
import AgendarCitaPage from "../pages/AgendarCitaPage";
import AnalisisPage from "../pages/AnalisisPage";
import MisCitasPage from "../pages/MisCitasPage"; 
import VerPacientesPage from "../pages/VerPacientesPage";
import EditarPacientePage from "../pages/EditarPacientePage";


import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/no-autorizado" element={<NoAutorizado />} />

      {/* Rutas protegidas */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute rolesPermitidos={["Administrador", "Fisioterapeuta"]}>
            <HomePage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/usuarios" 
        element={
          <ProtectedRoute rolesPermitidos={["Administrador"]}>
            <AdminUsuariosPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/menuevaluacion"
        element={
          <ProtectedRoute rolesPermitidos={["Administrador", "Fisioterapeuta"]}>
            <EvaluacionPage />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/evaluaciones/nueva" 
        element={
          <ProtectedRoute rolesPermitidos={["Administrador", "Fisioterapeuta"]}>
            <NuevaEvaluacionPage />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/evaluaciones/crearPaciente" 
        element={
          <ProtectedRoute rolesPermitidos={["Administrador", "Fisioterapeuta"]}>
            <NuevoPacientePage />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/evaluaciones/verPacientes"  
        element={
          <ProtectedRoute rolesPermitidos={["Administrador", "Fisioterapeuta"]}>
            <VerPacientesPage />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/evaluaciones/editarPaciente/:id" 
        element={
          <ProtectedRoute rolesPermitidos={["Administrador", "Fisioterapeuta"]}>
            <EditarPacientePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tomaDatosClinicos" 
        element={
          <ProtectedRoute rolesPermitidos={["Administrador", "Fisioterapeuta"]}>
            <TomaDeDatos />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/evaluaciones/seguimiento" 
        element={
          <ProtectedRoute rolesPermitidos={["Administrador", "Fisioterapeuta"]}>
            <SeguimientoPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/disponibilidad" 
        element={
          <ProtectedRoute rolesPermitidos={["Administrador", "Fisioterapeuta"]}>
            <DisponibilidadPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/agendar-cita" 
        element={
          <ProtectedRoute rolesPermitidos={["Administrador", "Fisioterapeuta"]}>
            <AgendarCitaPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/analisis" 
        element={
          <ProtectedRoute rolesPermitidos={["Administrador", "Fisioterapeuta"]}>
            <AnalisisPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/mis-citas" 
        element={
          <ProtectedRoute rolesPermitidos={["Administrador", "Fisioterapeuta"]}>
            <MisCitasPage />
          </ProtectedRoute>
        } 
      />


      {/* Ruta comodín */}
      <Route path="*" element={<Navigate to="/no-autorizado" />} />
    </Routes>
    
  );
};

export default AppRoutes;
