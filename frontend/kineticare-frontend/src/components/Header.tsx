import { useEffect, useState } from "react";
import { FaUser, FaBell } from "react-icons/fa";
import udlaLogo from "../assets/udla-logo-doslineas.png";
import {
  obtenerNotificaciones,
  marcarNotificacionComoLeida,
  marcarTodasNotificacionesComoLeidas,
} from "../services/api";
import { HubConnectionBuilder, HubConnection, HttpTransportType } from "@microsoft/signalr";
import { toast } from "react-toastify";

interface Notificacion {
  id: number;
  titulo: string;
  mensaje: string;
  leido: boolean;
  fechaEnvio: string;
}

interface HeaderProps {
  userId: string;
  tipo: "Usuario" | "Paciente";
}

function Header({ userId, tipo }: HeaderProps) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [connection, setConnection] = useState<HubConnection | null>(null);

  const noLeidas = notificaciones.filter((n) => !n.leido).length;

  // Cargar notificaciones iniciales
  useEffect(() => {
    if (userId && tipo) {
      obtenerNotificaciones(userId, tipo)
        .then((data) => setNotificaciones(data))
        .catch((error) =>
          console.error("Error al cargar notificaciones:", error)
        );
    }
  }, [userId, tipo]);

  // Conexión a SignalR
  useEffect(() => {
    if (!userId || !tipo) return;

    const nuevaConexion = new HubConnectionBuilder()
      .withUrl(`http://172.31.56.57:5010/hub/notificaciones?userId=${userId}&tipo=${tipo}`, {
        transport: HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    nuevaConexion
      .start()
      .then(() => {
        console.log("✅ Conectado a SignalR");

        nuevaConexion.on("RecibirNotificacion", (data) => {
          console.log("🔔 Nueva notificación:", data);

          // ✅ Mostrar toast con react-toastify
          toast.info(
            <>
              <strong>{data.titulo}</strong>
              <div>{data.mensaje}</div>
            </>,
            {
              icon: <span role="img" aria-label="notificación">🔔</span>,
            }
          );

          // ✅ Agregar al estado de notificaciones
          setNotificaciones((prev) => [
            {
              id: Date.now(), // temporal
              titulo: data.titulo,
              mensaje: data.mensaje,
              leido: false,
              fechaEnvio: data.fecha ?? new Date().toISOString(),
            },
            ...prev,
          ]);
        });

        setConnection(nuevaConexion);
      })
      .catch((err) => console.error("❌ Error en SignalR:", err));

    return () => {
      nuevaConexion.stop();
    };
  }, [userId, tipo]);

  const manejarClickNotificacion = async (id: number) => {
    await marcarNotificacionComoLeida(id);
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leido: true } : n))
    );
  };

  const manejarMarcarTodasComoLeidas = async () => {
    await marcarTodasNotificacionesComoLeidas(userId, tipo);
    setNotificaciones((prev) =>
      prev.map((n) => ({ ...n, leido: true }))
    );
  };

  return (
    <header className="w-full bg-white shadow px-6 py-3 grid grid-cols-3 items-center z-50">
      {/* Izquierda: Logo */}
      <div className="flex items-center">
        <img
          src={udlaLogo}
          alt="Logo UDLA"
          className="h-16 w-auto object-contain"
        />
      </div>

      {/* Centro: Frase */}
      <div className="flex justify-center">
        <p className="text-udla-black font-semibold text-md italic text-center">
          El mundo necesita gente que ame lo que hace.
        </p>
      </div>

      {/* Derecha: Notificaciones y perfil */}
      <div className="flex justify-end items-center gap-x-6 relative">
        {/* Botón de notificaciones */}
        <button
          className="relative text-udla-red text-2xl hover:text-red-700 transition"
          aria-label="Notificaciones"
          onClick={() => setMostrarDropdown(!mostrarDropdown)}
        >
          <FaBell />
          {noLeidas > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
              {noLeidas}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {mostrarDropdown && (
          <div className="absolute right-10 top-10 w-80 bg-white shadow-lg border rounded z-50">
            <div className="p-3">
              <h3 className="font-bold text-gray-700 mb-2">Notificaciones</h3>

              {/* Botón "Marcar todas como leídas" */}
              {notificaciones.length > 0 && (
                <button
                  onClick={manejarMarcarTodasComoLeidas}
                  className="text-xs text-blue-600 hover:underline mb-2"
                >
                  Marcar todas como leídas
                </button>
              )}

              {/* Lista de notificaciones */}
              {notificaciones.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No tienes notificaciones
                </p>
              ) : (
                <ul className="space-y-2 max-h-64 overflow-y-auto">
                  {notificaciones.map((n) => (
                    <li
                      key={n.id}
                      onClick={() => manejarClickNotificacion(n.id)}
                      className={`cursor-pointer p-2 border rounded text-sm ${
                        !n.leido ? "bg-gray-100 font-semibold" : ""
                      }`}
                    >
                      <strong>{n.titulo}</strong>
                      <p className="text-gray-600">{n.mensaje}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(n.fechaEnvio).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Botón de perfil */}
        <button
          className="text-udla-red text-2xl hover:text-red-700 transition"
          aria-label="Perfil"
        >
          <FaUser />
        </button>
      </div>
    </header>
  );
}

export default Header;
