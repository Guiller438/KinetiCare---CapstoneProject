import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

const ProtectedRoute = ({
  children,
  rolesPermitidos = [],
}: {
  children: ReactNode;
  rolesPermitidos?: string[];
}) => {
    // Obtener el token y rol del localStorage
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  if (!token) {
    return <Navigate to="/" />;
  }

  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(rol || "")) {
    return <Navigate to="/no-autorizado" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
