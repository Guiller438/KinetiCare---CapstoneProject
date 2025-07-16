import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCog,
  FaUnlockAlt,
  FaSignOutAlt,
  FaClipboardList,
  FaClock,
  FaCalendarAlt,
  FaChartBar,
} from "react-icons/fa";
import adminIcon from "../assets/GestionDeUsuarios.png";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import api from "../services/api";
import Switch from "react-switch";
import videoFondo from "../assets/fisioudla.mp4";

// Tipo para las tarjetas del menú
interface OpcionCard {
  titulo: string;
  descripcion: string;
  icono: React.ReactNode;
  path?: string;
  externalLink?: string;
  action?: () => void;
}

function HomePage() {
  const navigate = useNavigate();
  const [vistaAdmin, setVistaAdmin] = useState(true);
  const [rol, setRol] = useState<string | null>(null);

  const userId = localStorage.getItem("usuarioId") || "1";
  const tipo = (localStorage.getItem("tipo") as "Usuario" | "Paciente") || "Usuario";

  useEffect(() => {
    const rolGuardado = localStorage.getItem("rol");
    setRol(rolGuardado);

    if (rolGuardado !== "Administrador") {
      setVistaAdmin(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.warning("No hay sesión activa");
        return;
      }

      await api.post("/api/auth/logout", {}, { headers: { Authorization: `Bearer ${token}` } });

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("tipo");
      localStorage.removeItem("rol");

      toast.info("Has cerrado sesión correctamente");
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("❌ Error al cerrar sesión");
    }
  };

  // Opciones para fisioterapeutas
  const opcionesFisio: OpcionCard[] = [
    { 
      titulo: "Evaluaciones", 
      descripcion: "Registra y consulta evaluaciones fisioterapéuticas.", 
      icono: <FaClipboardList size={40} className="text-udla-red" />, 
      path: "/menuevaluacion" 
    },
    { 
      titulo: "Gestionar mi disponibilidad", 
      descripcion: "Establece tus horarios de atención semanales.", 
      icono: <FaClock size={40} className="text-udla-red" />, 
      path: "/disponibilidad" 
    },
    { 
      titulo: "Agendar cita", 
      descripcion: "Selecciona horario y paciente para registrar una nueva cita.", 
      icono: <FaCalendarAlt size={40} className="text-udla-red" />, 
      path: "/agendar-cita" 
    },
    {
      titulo: "Mis citas",
      descripcion: "Consulta las citas que has agendado.",
      icono: <FaCalendarAlt size={40} className="text-udla-red" />,
      path: "/mis-citas"
    },
    {
      titulo: "Análisis y métricas",
      descripcion: "Accede al tablero de análisis y métricas en tiempo real.",
      icono: <FaChartBar size={40} className="text-udla-red" />,
      path: "/analisis",
    },
    { 
      titulo: "Cerrar sesión", 
      descripcion: "Finaliza tu sesión actual.", 
      icono: <FaSignOutAlt size={40} className="text-udla-red" />, 
      action: handleLogout 
    },
  ];

  // Opciones para Administrador
  const opcionesAdmin: OpcionCard[] = [
    { titulo: "Gestión de usuarios", descripcion: "Registra, actualiza y administra usuarios del sistema.", icono: <FaUserCog size={40} className="text-udla-red" />, path: "/register" },
    { titulo: "Reset de contraseña", descripcion: "Recupera el acceso fácilmente.", icono: <FaUnlockAlt size={40} className="text-udla-red" />, path: "/reset-password" },
    { titulo: "Gestión administrativa", descripcion: "Control y monitoreo de todos los usuarios registrados.", icono: <img src={adminIcon} alt="Gestión administrativa" className="h-20 w-15" />, path: "/usuarios" },
    { titulo: "Cerrar sesión", descripcion: "Finaliza tu sesión actual.", icono: <FaSignOutAlt size={40} className="text-udla-red" />, action: handleLogout },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      <video className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-30" autoPlay loop muted>
        <source src={videoFondo} type="video/mp4" />
        Tu navegador no soporta el video.
      </video>

      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-10"></div>

      <div className="relative z-20 flex flex-col min-h-screen">
        <Header userId={userId} tipo={tipo} />

        <main className="flex-grow flex flex-col items-center px-4 py-10">
          <h1 className="text-3xl font-bold text-udla-red mb-10">
            Bienvenido a KinetiCare
          </h1>

          {rol === "Administrador" && (
            <div className="flex items-center gap-4 mb-8">
              <span className="text-white font-medium">Gestión Fisioterapéutica</span>
              <Switch
                onChange={() => setVistaAdmin(!vistaAdmin)}
                checked={vistaAdmin}
                checkedIcon={false}
                uncheckedIcon={false}
                onColor="#9c0720"
                offColor="#ccc"
              />
              <span className="text-white font-medium">Gestión Administrativa</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
            {(vistaAdmin ? opcionesAdmin : opcionesFisio).map((opcion, index) => (
              <div
                key={index}
                onClick={() => {
                  if (opcion.action) {
                    opcion.action();
                  } else if (opcion.externalLink) {
                    window.open(opcion.externalLink, "_blank");
                  } else if (opcion.path) {
                    navigate(opcion.path);
                  }
                }}
                className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition"
              >
                {opcion.icono}
                <h2 className="text-xl font-semibold mt-4 mb-2 text-udla-red">
                  {opcion.titulo}
                </h2>
                <p className="text-gray-600 text-sm">{opcion.descripcion}</p>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default HomePage;
