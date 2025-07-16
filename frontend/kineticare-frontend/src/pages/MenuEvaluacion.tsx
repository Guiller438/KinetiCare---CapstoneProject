import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaUserCheck,
  FaHeartbeat,
  FaUserPlus,
  FaArrowLeft,
  FaUsers,
} from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import videoFondo from "../assets/fisioudla2.mp4";

const MenuEvaluacionPage = () => {
  const navigate = useNavigate();

  const manejarSeleccion = (ruta: string) => {
    navigate(ruta);
  };

  const volverAlMenuPrincipal = () => {
    navigate("/home");
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      {/* 🎥 Video de fondo */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-30"
        autoPlay
        loop
        muted
      >
        <source src={videoFondo} type="video/mp4" />
        Tu navegador no soporta el video.
      </video>

      {/* Fondo semitransparente */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-10"></div>

      {/* Contenido principal */}
      <div className="relative z-20 flex flex-col min-h-screen">
        <Header userId={localStorage.getItem("usuarioId") || "0"} tipo="Usuario" />

        <main className="flex-grow flex flex-col items-center px-4 py-10">
          <button
            onClick={volverAlMenuPrincipal}
            className="mb-8 flex items-center gap-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            <FaArrowLeft /> Volver al Menú Principal
          </button>

          <h1 className="text-3xl font-bold text-white mb-10">Evaluaciones de Pacientes</h1>

          <div className="flex flex-wrap justify-center gap-8">
            {/* Nueva Evaluación */}
            <div
              onClick={() => manejarSeleccion("/evaluaciones/nueva")}
              className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 w-64 text-center hover:shadow-2xl transition"
            >
              <FaClipboardList className="text-5xl mx-auto text-udla-red mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-udla-red">Nueva Evaluación</h2>
              <p className="text-gray-600">
                Registra una evaluación inicial para un paciente.
              </p>
            </div>

            {/* Seguimiento */}
            <div
              onClick={() => manejarSeleccion("/evaluaciones/seguimiento")}
              className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 w-64 text-center hover:shadow-2xl transition"
            >
              <FaUserCheck className="text-5xl mx-auto text-udla-red mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-udla-red">Seguimiento</h2>
              <p className="text-gray-600">
                Realiza un seguimiento periódico a evaluaciones previas.
              </p>
            </div>

            {/* Toma de Datos Clínicos */}
            <div
              onClick={() => manejarSeleccion("/tomaDatosClinicos")}
              className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 w-64 text-center hover:shadow-2xl transition"
            >
              <FaHeartbeat className="text-5xl mx-auto text-udla-red mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-udla-red">Toma de Datos Clínicos</h2>
              <p className="text-gray-600">
                Captura movimientos mediante las herramientas para el diagnóstico.
              </p>
            </div>

            {/* Registrar Paciente */}
            <div
              onClick={() => manejarSeleccion("/evaluaciones/crearPaciente")}
              className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 w-64 text-center hover:shadow-2xl transition"
            >
              <FaUserPlus className="text-5xl mx-auto text-udla-red mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-udla-red">Registrar Paciente</h2>
              <p className="text-gray-600">
                Crea un nuevo paciente para realizar evaluaciones futuras.
              </p>
            </div>

            {/* ✅ NUEVA TARJETA: Ver Pacientes */}
            <div
              onClick={() => manejarSeleccion("/evaluaciones/verPacientes")}
              className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 w-64 text-center hover:shadow-2xl transition"
            >
              <FaUsers className="text-5xl mx-auto text-udla-red mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-udla-red">Ver Pacientes</h2>
              <p className="text-gray-600">
                Consulta y gestiona todos los pacientes registrados.
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MenuEvaluacionPage;
