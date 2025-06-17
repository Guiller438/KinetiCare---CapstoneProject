import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../services/api";
import { toast } from "react-toastify";

interface Disponibilidad {
  disponibilidadId: number;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
}

function DisponibilidadPage() {
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad[]>([]);
  const [diaSemana, setDiaSemana] = useState<number>(1);
  const [horaInicio, setHoraInicio] = useState<string>("08:00");
  const [horaFin, setHoraFin] = useState<string>("12:00");
  const fisioterapeutaId = parseInt(localStorage.getItem("usuarioId") || "0");

  const dias = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const cargarDisponibilidad = async () => {
    try {
      const response = await api.get(
        `/api/Disponibilidad/fisioterapeuta/${fisioterapeutaId}`
      );
      setDisponibilidad(response.data);
    } catch (error) {
      toast.error("No se pudo cargar la disponibilidad");
    }
  };

  const validarSolapamiento = () => {
    return disponibilidad.some((item) =>
      item.diaSemana === diaSemana &&
      (
        (horaInicio >= item.horaInicio && horaInicio < item.horaFin) ||
        (horaFin > item.horaInicio && horaFin <= item.horaFin) ||
        (horaInicio <= item.horaInicio && horaFin >= item.horaFin)
      )
    );
  };

  const agregarDisponibilidad = async (e: React.FormEvent) => {
    e.preventDefault();

    const horaMinima = "08:00";
    const horaMaxima = "22:00";

    if (horaInicio >= horaFin) {
      toast.warning("⚠️ La hora de inicio debe ser menor a la hora de fin.");
      return;
    }

    if (horaInicio < horaMinima || horaFin > horaMaxima) {
      toast.warning("⚠️ Las horas deben estar entre 08:00 y 22:00.");
      return;
    }

    if (validarSolapamiento()) {
      toast.warning("⚠️ El horario se solapa con uno ya registrado.");
      return;
    }

    try {
      await api.post("/api/Disponibilidad", {
        fisioterapeutaId,
        diaSemana,
        horaInicio,
        horaFin,
      });
      toast.success("✅ Disponibilidad agregada exitosamente");
      cargarDisponibilidad();
    } catch (error) {
      toast.error("❌ Error al agregar disponibilidad");
    }
  };

  const eliminarDisponibilidad = async (id: number) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar esta disponibilidad?");
    if (!confirmar) return;

    try {
      await api.delete(`/api/Disponibilidad/EliminarDisponibilidad/${id}`);
      toast.success("🗑️ Disponibilidad eliminada correctamente");
      cargarDisponibilidad();
    } catch (error) {
      toast.error("❌ Error al eliminar disponibilidad");
    }
  };

  useEffect(() => {
    cargarDisponibilidad();
  }, []);

  const disponibilidadOrdenada = [...disponibilidad].sort((a, b) => {
    if (a.diaSemana !== b.diaSemana) return a.diaSemana - b.diaSemana;
    return a.horaInicio.localeCompare(b.horaInicio);
  });

  return (
    <div className="min-h-screen bg-udla-light flex flex-col">
      <Header
        userId={localStorage.getItem("usuarioId") || "1"}
        tipo={
          (localStorage.getItem("tipo") === "Usuario" || localStorage.getItem("tipo") === "Paciente")
            ? (localStorage.getItem("tipo") as "Usuario" | "Paciente")
            : "Usuario"
        }
      />

      <main className="flex-grow container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-udla-red mb-6">
          Gestionar mi disponibilidad
        </h2>

        <form
          onSubmit={agregarDisponibilidad}
          className="bg-white shadow-md rounded-lg p-6 mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block font-medium mb-1">Día de la semana</label>
              <select
                className="w-full border rounded p-2"
                value={diaSemana}
                onChange={(e) => setDiaSemana(parseInt(e.target.value))}
              >
                {dias.map((dia, index) => (
                  <option key={index} value={index}>
                    {dia}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Hora inicio</label>
              <input
                type="time"
                min="08:00"
                max="21:59"
                className="w-full border rounded p-2"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Hora fin</label>
              <input
                type="time"
                min="08:01"
                max="22:00"
                className="w-full border rounded p-2"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 bg-udla-red text-white px-6 py-2 rounded hover:bg-red-700"
          >
            Agregar disponibilidad
          </button>
        </form>

        {/* Tabla de disponibilidad centrada */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-4">Disponibilidad registrada</h3>
          <div className="bg-white shadow rounded-lg overflow-x-auto w-full max-w-3xl">
            <table className="w-full table-auto text-center">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-3">Día</th>
                  <th className="px-4 py-3">Hora Inicio</th>
                  <th className="px-4 py-3">Hora Fin</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {disponibilidadOrdenada.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No hay disponibilidad registrada.
                    </td>
                  </tr>
                )}
                {disponibilidadOrdenada.map((item, index) => (
                  <tr
                    key={item.disponibilidadId}
                    className={`border-t ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="px-4 py-3">{dias[item.diaSemana]}</td>
                    <td className="px-4 py-3">{item.horaInicio}</td>
                    <td className="px-4 py-3">{item.horaFin}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => eliminarDisponibilidad(item.disponibilidadId)}
                        className="text-white bg-red-500 hover:bg-red-700 px-3 py-1 rounded"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DisponibilidadPage;
