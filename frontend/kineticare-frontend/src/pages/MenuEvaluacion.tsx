import { useNavigate } from "react-router-dom";
import { FaClipboardList, FaUserCheck, FaHeartbeat, FaUserPlus, FaArrowLeft } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MenuEvaluacionPage = () => {
  const navigate = useNavigate();

  const manejarSeleccion = (ruta: string) => {
    navigate(ruta);
  };

  const volverAlMenuPrincipal = () => {
    navigate("/home"); // Cambia si tu menú principal está en otra ruta
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-grow container mx-auto px-4 py-8">
        {/* Botón de Volver */}
        <div className="mb-6">
          <button
            onClick={volverAlMenuPrincipal}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded"
          >
            <FaArrowLeft />
            Volver al Menú Principal
          </button>
        </div>

        <h1 className="text-3xl font-bold text-center text-rose-700 mb-8">
          Evaluaciones de Pacientes
        </h1>

        <div className="flex flex-wrap justify-center gap-8">
          {/* Nueva Evaluación */}
          <div
            onClick={() => manejarSeleccion("/evaluaciones/nueva")}
            className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 w-64 text-center hover:shadow-2xl transition"
          >
            <FaClipboardList className="text-5xl mx-auto text-rose-700 mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-rose-700">
              Nueva Evaluación
            </h2>
            <p className="text-gray-600">
              Registra una evaluación inicial para un paciente.
            </p>
          </div>

          {/* Seguimiento */}
          <div
            onClick={() => manejarSeleccion("/evaluaciones/seguimiento")}
            className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 w-64 text-center hover:shadow-2xl transition"
          >
            <FaUserCheck className="text-5xl mx-auto text-rose-700 mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-rose-700">
              Seguimiento
            </h2>
            <p className="text-gray-600">
              Realiza un seguimiento periódico a evaluaciones previas.
            </p>
          </div>

          {/* Toma de Datos Clínicos */}
          <div
            onClick={() => manejarSeleccion("/tomaDatosClinicos")}
            className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 w-64 text-center hover:shadow-2xl transition"
          >
            <FaHeartbeat className="text-5xl mx-auto text-rose-700 mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-rose-700">
              Toma de Datos Clínicos
            </h2>
            <p className="text-gray-600">
              Captura movimientos mediante las herramientas para el diagnóstico.
            </p>
          </div>

          {/* Registrar Paciente */}
          <div
            onClick={() => manejarSeleccion("/evaluaciones/crearPaciente")}
            className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 w-64 text-center hover:shadow-2xl transition"
          >
            <FaUserPlus className="text-5xl mx-auto text-rose-700 mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-rose-700">
              Registrar Paciente
            </h2>
            <p className="text-gray-600">
              Crea un nuevo paciente para realizar evaluaciones futuras.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MenuEvaluacionPage;
