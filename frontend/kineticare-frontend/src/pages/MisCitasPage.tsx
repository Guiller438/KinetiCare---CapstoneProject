import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../services/api";
import { toast } from "react-toastify";

interface Cita {
  citaId: number;
  pacienteNombre: string;
  fechaHora: string;
  observaciones: string;
}

function MisCitasPage() {
  const fisioterapeutaId = localStorage.getItem("usuarioId") || "0";
  const tipo = (localStorage.getItem("tipo") === "Paciente" ? "Paciente" : "Usuario") as "Usuario" | "Paciente";

  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarCitas = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token no disponible. Inicia sesión de nuevo.");
        return;
      }

      const response = await api.get(`/api/Citas/fisioterapeuta/${fisioterapeutaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCitas(response.data);
    } catch (error) {
      console.error("Error al obtener citas:", error);
      toast.error("Error al obtener citas");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header userId={fisioterapeutaId} tipo={tipo} />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Mis Citas</h2>

        {cargando ? (
          <p className="text-center">Cargando citas...</p>
        ) : citas.length === 0 ? (
          <p className="text-center">No hay citas registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-[#c8102e] text-white">
                  <th className="py-2 px-4 text-left">Paciente</th>
                  <th className="py-2 px-4 text-left">Fecha</th>
                  <th className="py-2 px-4 text-left">Hora</th>
                  <th className="py-2 px-4 text-left">Observación</th>
                </tr>
              </thead>
              <tbody>
                {citas.map((cita) => {
                  const fechaObj = new Date(cita.fechaHora);
                  const fecha = fechaObj.toLocaleDateString("es-EC", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });
                  const hora = fechaObj.toLocaleTimeString("es-EC", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr key={cita.citaId} className="border-t border-gray-200 hover:bg-gray-100">
                      <td className="py-2 px-4">{cita.pacienteNombre}</td>
                      <td className="py-2 px-4">{fecha}</td>
                      <td className="py-2 px-4">{hora}</td>
                      <td className="py-2 px-4">{cita.observaciones || "Sin observaciones"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default MisCitasPage;
