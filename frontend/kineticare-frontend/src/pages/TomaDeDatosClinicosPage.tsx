import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
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
  const location = useLocation();
  const { pacienteNombre = "Paciente desconocido" } = location.state || {};

  const [expandedView, setExpandedView] = useState<"kinect" | "astra" | "both" | null>(null);
  const [modoAstra, setModoAstra] = useState<"rgb" | "depth">("rgb");
  const [imagenKinectURL, setImagenKinectURL] = useState("");

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

  // 🔁 Refrescar imagen Kinect cada 150ms
  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = new Date().getTime();
      setImagenKinectURL(`http://192.168.200.9:59402/api/joints/render?t=${timestamp}`);
    }, 10);

    return () => clearInterval(interval);
  }, []);

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

        {/* Título */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-rose-700">Toma de Datos Clínicos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Visualización en tiempo real de datos capturados por sensores de movimiento.
          </p>
        </div>

        {/* Ficha paciente */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3 mb-6 flex items-center gap-3 max-w-lg mx-auto">
          <span className="text-2xl text-rose-600">👤</span>
          <div>
            <p className="text-lg font-semibold text-gray-800">{pacienteNombre}</p>
            <p className="text-sm text-gray-500">Paciente en evaluación</p>
          </div>
        </section>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
          <button
            onClick={handleCaptura}
            className="bg-emerald-600 text-white px-6 py-2 rounded-full shadow hover:bg-emerald-700 transition"
          >
            Capturar Imagen RGB y Profundidad
          </button>
          <button
            onClick={() => setExpandedView("both")}
            className="bg-rose-600 text-white px-6 py-2 rounded-full shadow hover:bg-rose-700 transition"
          >
            Ver ambas cámaras en pantalla completa
          </button>
        </div>

        {/* Cámaras */}
        <section className="grid md:grid-cols-2 gap-6">
          {/* Kinect */}
          <div className="bg-white rounded-xl shadow-md p-4 relative w-full">
            <button
              onClick={() => setExpandedView("kinect")}
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
              title="Expandir Kinect"
            >
              <FaExpand className="text-gray-700" />
            </button>
            <h3 className="text-center text-lg font-semibold text-rose-700 mb-3">
              🎥 Cámara Kinect Azure
            </h3>
            <div className="rounded-md overflow-hidden aspect-video bg-black">
              <img
                src={imagenKinectURL}
                alt="Vista Kinect"
                className="w-full h-full object-cover"
              />
            </div>
            <ul className="text-sm text-gray-600 space-y-1 mt-4 px-2">
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
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
          <div className="bg-white rounded-xl shadow-md p-4 relative w-full">
            <button
              onClick={() => setExpandedView("astra")}
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-gray-200"
              title="Expandir Astra"
            >
              <FaExpand className="text-gray-700" />
            </button>
            <h3 className="text-center text-lg font-semibold text-rose-700 mb-3">
              🎥 Cámara Astra
            </h3>

            <div className="flex justify-center gap-3 mb-4">
              <div className="bg-gray-100 rounded-full px-3 py-1 flex gap-2 shadow-inner">
                <button
                  onClick={() => setModoAstra("rgb")}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                    modoAstra === "rgb"
                      ? "bg-rose-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  RGB
                </button>
                <button
                  onClick={() => setModoAstra("depth")}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                    modoAstra === "depth"
                      ? "bg-rose-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Profundidad
                </button>
              </div>
            </div>

            <div className="rounded-md overflow-hidden aspect-video">
              <img
                src={`http://localhost:8001/astra/stream-${modoAstra}-mjpeg`}
                alt="Vista Cámara Astra"
                className="w-full h-full object-cover"
              />
            </div>
            <ul className="text-sm text-gray-600 space-y-1 mt-4 px-2">
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
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

        {/* Vista Expandida */}
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
                  <div className="bg-black h-[540px] rounded-md overflow-hidden">
                    <img
                      src={imagenKinectURL}
                      alt="Stream Kinect Expandido"
                      className="w-full h-full object-cover"
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
