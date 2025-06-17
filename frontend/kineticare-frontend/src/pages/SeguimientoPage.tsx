import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { getUsuarioId } from "../utils/auth";
import ModalResumen from "../components/ModalResumen";

interface Evaluacion {
  id: number;
  pacienteId: number; // 👈 agregado para pasar a la siguiente pantalla
  paciente: string;
  fecha: string;
  detalle: string;
}

interface Seguimiento {
  id: number;
  fecha: string;
  observaciones: string;
}

const SeguimientoPage: React.FC = () => {
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([]);
  const [busqueda, setBusqueda] = useState<string>("");
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([]);
  const [pacienteNombre, setPacienteNombre] = useState<string>("");

  useEffect(() => {
    const fetchEvaluaciones = async () => {
      try {
        const usuarioId = getUsuarioId();
        if (!usuarioId) {
          console.warn("No se encontró el usuarioId del fisioterapeuta.");
          return;
        }

        const response = await fetch(
          `http://localhost:7003/api/Evaluacion/fisioterapeuta/${usuarioId}`
        );
        const data = await response.json();

        const evaluacionesFormateadas: Evaluacion[] = data.map((item: any) => ({
          id: item.evaluacionId,
          pacienteId: item.pacienteId, // 👈 necesario para "Continuar seguimiento"
          paciente: item.nombrePaciente,
          fecha: item.fecha.split("T")[0],
          detalle: item.observaciones || "Sin detalle",
        }));

        setEvaluaciones(evaluacionesFormateadas);
      } catch (error) {
        console.error("❌ Error al obtener evaluaciones:", error);
      }
    };

    fetchEvaluaciones();
  }, []);

  const abrirModalResumen = async (evaluacionId: number, paciente: string) => {
    try {
      const response = await fetch(
        `http://localhost:7003/api/Evaluacion/seguimiento/${evaluacionId}`
      );
      const data = await response.json();
      setSeguimientos(data);
      setPacienteNombre(paciente);
      setModalAbierto(true);
    } catch (error) {
      console.error("Error al obtener seguimientos:", error);
    }
  };

  const filtrarEvaluaciones = () => {
    return evaluaciones.filter((e) => {
      const coincideNombre = e.paciente.toLowerCase().includes(busqueda.toLowerCase());
      const fechaEval = new Date(e.fecha);
      const desde = fechaDesde ? new Date(fechaDesde) : null;
      const hasta = fechaHasta ? new Date(fechaHasta) : null;

      const enRango =
        (!desde || fechaEval >= desde) && (!hasta || fechaEval <= hasta);

      return coincideNombre && enRango;
    });
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFechaDesde("");
    setFechaHasta("");
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-100 px-4 py-10 md:px-10">
        <h1 className="text-3xl font-bold text-center text-rose-700 mb-8">
          Seguimiento de pacientes
        </h1>

        {/* Filtros */}
        <div className="max-w-6xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-rose-700 mb-1">
              Buscar por nombre
            </label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Ingrese nombre"
              className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-700"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-rose-700 mb-1">Fecha inicio</label>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-700"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-rose-700 mb-1">Fecha fin</label>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-700"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={limpiarFiltros}
              className="w-full bg-rose-700 text-white font-medium px-4 py-2 rounded-md hover:bg-rose-800 transition"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filtrarEvaluaciones().length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              No se encontraron pacientes con los filtros aplicados.
            </p>
          ) : (
            filtrarEvaluaciones().map((evalItem) => (
              <div
                key={evalItem.id}
                className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between transition hover:shadow-xl border border-gray-200"
              >
                <div className="flex items-center mb-4">
                  <ClipboardList className="h-6 w-6 text-rose-700 mr-2" />
                  <h2 className="text-lg font-bold text-rose-700">
                    {evalItem.paciente}
                  </h2>
                </div>

                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-medium text-rose-700">Última evaluación:</span>{" "}
                  {evalItem.fecha}
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  <span className="font-medium text-rose-700">Detalle:</span>{" "}
                  {evalItem.detalle}
                </p>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => abrirModalResumen(evalItem.id, evalItem.paciente)}
                    className="text-sm font-medium text-white bg-rose-700 px-3 py-2 rounded-md hover:bg-rose-800 transition"
                  >
                    Ver resumen
                  </button>
                  <Link
                    to="/evaluaciones/nueva"
                    state={{
                      evaluacionId: evalItem.id,
                      pacienteId: evalItem.pacienteId,
                    }}
                    className="text-sm font-medium text-white bg-rose-500 px-3 py-2 rounded-md hover:bg-rose-600 transition"
                  >
                    Continuar seguimiento
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <ModalResumen
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        seguimientos={seguimientos}
        nombrePaciente={pacienteNombre}
      />

      <Footer />
    </>
  );
};

export default SeguimientoPage;
