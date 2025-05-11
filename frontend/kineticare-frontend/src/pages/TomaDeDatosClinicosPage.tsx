import { useState } from "react";
import Header from "../components/Header";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCogs,
  FaRulerCombined,
  FaExpand,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const TomaDatosClinicosPage = () => {
  const [expandedView, setExpandedView] = useState<"kinect" | "astra" | "both" | null>(null);
  const [modoAstra, setModoAstra] = useState<"rgb" | "depth">("rgb");

  const paciente = {
    nombre: "Juan Pérez",
    diagnostico: "Lesión en rodilla derecha - Evaluación en curso",
  };

  const kinectInfo = {
    estado: "Conectado",
    fps: 30,
    resolucion: "1920x1080",
  };

  const astraInfo = {
    estado: "Conectado",
    fps: 30,
    resolucion: "1280x720",
  };

  const handleCaptura = async () => {
    try {
      const [resRGB, resDepth] = await Promise.all([
        fetch("http://localhost:8000/astra/capture?modo=rgb"),
        fetch("http://localhost:8000/astra/capture?modo=depth"),
      ]);

      if (resRGB.ok && resDepth.ok) {
        alert("✅ Captura realizada correctamente.");
      } else {
        alert("⚠️ Falló la captura. Revisa el backend.");
      }
    } catch (error) {
      alert("❌ Error al comunicarse con el servidor.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-6 relative">
        <div className="text-center mb-3">
          <h1 className="inline text-3xl font-bold text-rose-700 mr-2">
            Toma de Datos Clínicos
          </h1>
          <span className="inline text-gray-500 italic text-sm">
            Visualización en tiempo real de datos capturados por sensores de movimiento.
          </span>
        </div>

        <section className="mb-4 text-sm text-gray-700 flex flex-col sm:flex-row justify-between items-center gap-1 px-2">
          <span><strong>👤</strong> {paciente.nombre}</span>
          <span><strong>🧾</strong> {paciente.diagnostico}</span>
        </section>

        <div className="flex justify-center mb-4">
          <button
            onClick={handleCaptura}
            className="bg-emerald-600 text-white px-6 py-2 rounded-full shadow hover:bg-emerald-700 transition"
          >
            Capturar Imagen RGB y Profundidad
          </button>
        </div>

        {expandedView === null && (
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setExpandedView("both")}
              className="bg-rose-600 text-white px-6 py-2 rounded-full shadow hover:bg-rose-700 transition"
            >
              Ver ambas cámaras en pantalla completa
            </button>
          </div>
        )}

        <section className="grid md:grid-cols-2 gap-4">
          {/* Kinect */}
          <div className="bg-white rounded-xl shadow-md p-3 relative w-full">
            <button
              onClick={() => setExpandedView("kinect")}
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
              title="Expandir Kinect"
            >
              <FaExpand className="text-gray-700" />
            </button>
            <h3 className="text-center text-base font-semibold text-rose-700 mb-2">
              🎥 Cámara Kinect Azure
            </h3>
            <div className="rounded-md overflow-hidden aspect-video bg-black flex items-center justify-center text-white">
              Stream Kinect (simulado)
            </div>
            <ul className="text-sm text-gray-600 space-y-1 mt-3 px-2">
              <li className="flex items-center gap-2">
                {kinectInfo.estado === "Conectado" ? (
                  <FaCheckCircle className="text-green-600" />
                ) : (
                  <FaTimesCircle className="text-red-600" />
                )}
                <span>Estado: {kinectInfo.estado}</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCogs className="text-blue-600" />
                <span>FPS: {kinectInfo.fps}</span>
              </li>
              <li className="flex items-center gap-2">
                <FaRulerCombined className="text-purple-600" />
                <span>Resolución: {kinectInfo.resolucion}</span>
              </li>
            </ul>
          </div>

          {/* Astra */}
          <div className="bg-white rounded-xl shadow-md p-3 relative w-full">
            <button
              onClick={() => setExpandedView("astra")}
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
              title="Expandir Astra"
            >
              <FaExpand className="text-gray-700" />
            </button>
            <h3 className="text-center text-base font-semibold text-rose-700 mb-2">
              🎥 Cámara Astra
            </h3>

            {/* Selector RGB / profundidad */}
            <div className="flex justify-center gap-2 mb-2">
              <button
                onClick={() => setModoAstra("rgb")}
                className={`px-4 py-1 rounded-full text-sm shadow ${
                  modoAstra === "rgb" ? "bg-rose-600 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                RGB
              </button>
              <button
                onClick={() => setModoAstra("depth")}
                className={`px-4 py-1 rounded-full text-sm shadow ${
                  modoAstra === "depth" ? "bg-rose-600 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                Profundidad
              </button>
            </div>

            <div className="rounded-md overflow-hidden aspect-video">
              <img
                src={`http://localhost:8000/astra/stream-${modoAstra}-mjpeg`}
                alt="Vista Cámara Astra"
                className="w-full h-full object-cover"
              />
            </div>
            <ul className="text-sm text-gray-600 space-y-1 mt-3 px-2">
              <li className="flex items-center gap-2">
                {astraInfo.estado === "Conectado" ? (
                  <FaCheckCircle className="text-green-600" />
                ) : (
                  <FaTimesCircle className="text-red-600" />
                )}
                <span>Estado: {astraInfo.estado}</span>
              </li>
              <li className="flex items-center gap-2">
                <FaCogs className="text-blue-600" />
                <span>FPS: {astraInfo.fps}</span>
              </li>
              <li className="flex items-center gap-2">
                <FaRulerCombined className="text-purple-600" />
                <span>Resolución: {astraInfo.resolucion}</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Pantalla expandida */}
        <AnimatePresence>
          {expandedView !== null && (
            <motion.div
              className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.button
                onClick={() => setExpandedView(null)}
                className="absolute top-4 right-4 bg-white px-4 py-2 rounded shadow text-gray-700 hover:bg-gray-100 z-50"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                Cerrar pantalla completa
              </motion.button>

              {expandedView === "kinect" && (
                <motion.div
                  className="bg-white w-full max-w-5xl rounded-2xl shadow-lg p-6"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-center text-xl font-semibold text-rose-700 mb-4">
                    🎥 Cámara Kinect Azure
                  </h3>
                  <div className="bg-black h-[540px] rounded-md flex items-center justify-center text-white">
                    Stream Kinect (simulado)
                  </div>
                </motion.div>
              )}

              {expandedView === "astra" && (
                <motion.div
                  className="bg-white w-full max-w-5xl rounded-2xl shadow-lg p-6"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-center text-xl font-semibold text-rose-700 mb-4">
                    🎥 Cámara Astra
                  </h3>
                  <div className="rounded-md overflow-hidden h-[540px]">
                    <img
                      src={`http://localhost:8000/astra/stream-${modoAstra}-mjpeg`}
                      alt="Vista Cámara Astra Expandida"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              )}

              {expandedView === "both" && (
                <motion.div
                  className="w-full h-full flex flex-col gap-4 justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="bg-black w-full h-1/2 flex items-center justify-center text-white text-lg rounded-md">
                    Stream Kinect (simulado)
                  </div>
                  <div className="h-1/2 rounded-md overflow-hidden">
                    <img
                      src={`http://localhost:8000/astra/stream-${modoAstra}-mjpeg`}
                      alt="Vista Cámara Astra"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default TomaDatosClinicosPage;
