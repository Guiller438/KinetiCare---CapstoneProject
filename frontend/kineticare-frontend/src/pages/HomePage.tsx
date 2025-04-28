import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCog, FaUnlockAlt, FaSignOutAlt, FaClipboardList } from "react-icons/fa";
import adminIcon from "../assets/GestionDeUsuarios.png";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import api from "../services/api";
import Switch from "react-switch";

function HomePage() {
  const navigate = useNavigate();
  const [vistaAdmin, setVistaAdmin] = useState(true);
  const [rol, setRol] = useState<string | null>(null);

  useEffect(() => {
    const rolGuardado = localStorage.getItem("rol");
    setRol(rolGuardado);

    if (rolGuardado !== "Administrador") {
      setVistaAdmin(false); // Solo admins pueden ver la vista admin
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.warning("No hay sesión activa");
        return;
      }

      await api.post(
        "/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("token");
      toast.info("Has cerrado sesión correctamente");
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("❌ Error al cerrar sesión");
    }
  };

  // Opciones para vista fisioterapéutica
  const opcionesFisio = [
    {
      titulo: "Evaluaciones",
      descripcion: "Registra y consulta evaluaciones fisioterapéuticas.",
      icono: <FaClipboardList size={40} className="text-udla-red" />,
      path: "/menuevaluacion", // Asegúrate de que esta ruta exista
    },
    {
      titulo: "Cerrar sesión",
      descripcion: "Finaliza tu sesión actual.",
      icono: <FaSignOutAlt size={40} className="text-udla-red" />,
      action: handleLogout,
    },
  ];

  // Opciones para vista administrativa
  const opcionesAdmin = [
    {
      titulo: "Gestión de usuarios",
      descripcion: "Registra, actualiza y administra usuarios del sistema.",
      icono: <FaUserCog size={40} className="text-udla-red" />,
      path: "/register",
    },
    {
      titulo: "Reset de contraseña",
      descripcion: "Recupera el acceso fácilmente.",
      icono: <FaUnlockAlt size={40} className="text-udla-red" />,
      path: "/reset-password",
    },
    {
      titulo: "Gestión administrativa",
      descripcion: "Control y monitoreo de todos los usuarios registrados.",
      icono: <img src={adminIcon} alt="Gestión administrativa" className="h-20 w-15" />,
      path: "/usuarios",
    },
    {
      titulo: "Cerrar sesión",
      descripcion: "Finaliza tu sesión actual.",
      icono: <FaSignOutAlt size={40} className="text-udla-red" />,
      action: handleLogout,
    },
  ];

  return (
    <div className="min-h-screen bg-udla-light flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col items-center px-4 py-10">
        <h1 className="text-3xl font-bold text-udla-red mb-10">
          Bienvenido a KinetiCare
        </h1>

        {rol === "Administrador" && (
          <div className="flex items-center gap-4 mb-8">
            <span className="text-gray-700 font-medium">Gestión Fisioterapéutica</span>
            <Switch
              onChange={() => setVistaAdmin(!vistaAdmin)}
              checked={vistaAdmin}
              checkedIcon={false}
              uncheckedIcon={false}
              onColor="#9c0720"
              offColor="#ccc"
            />
            <span className="text-gray-700 font-medium">Gestión Administrativa</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {(vistaAdmin ? opcionesAdmin : opcionesFisio).map((opcion, index) => (
            <div
              key={index}
              onClick={() => {
                if (opcion.action) {
                  opcion.action();
                } else if (opcion.path) {
                  navigate(opcion.path);
                }
              }}
              className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition"
            >
              {opcion.icono}
              <h2 className="text-xl font-semibold mt-4 mb-2 text-udla-red">{opcion.titulo}</h2>
              <p className="text-gray-600 text-sm">{opcion.descripcion}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
