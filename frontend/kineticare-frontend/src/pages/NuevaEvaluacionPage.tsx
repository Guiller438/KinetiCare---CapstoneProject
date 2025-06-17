import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Select from "react-select";

interface Pregunta {
  id: number;
  texto: string;
}

interface Paciente {
  id: number;
  nombres: string;
  apellidos: string;
}

const NuevaEvaluacionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { evaluacionId, pacienteId } = location.state || {};

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<number | null>(pacienteId ?? null);
  const [preguntasDisponibles, setPreguntasDisponibles] = useState<Pregunta[]>([]);
  const [preguntasSeleccionadas, setPreguntasSeleccionadas] = useState<Pregunta[]>([]);
  const [respuestas, setRespuestas] = useState<{ [key: number]: string }>({});
  const [observaciones, setObservaciones] = useState("");
  const [cargando, setCargando] = useState<boolean>(true);
  const [mostrarFormularioNuevaPregunta, setMostrarFormularioNuevaPregunta] = useState(false);
  const [nuevaPreguntaTexto, setNuevaPreguntaTexto] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        const pacientesResponse = await api.get("/api/paciente/obtenerPacientes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const preguntasResponse = await api.get("/api/cuestionario/obtenerPreguntas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPacientes(pacientesResponse.data);
        setPreguntasDisponibles(preguntasResponse.data);
      } catch (error) {
        console.error("Error al cargar datos", error);
        toast.error("❌ Error al cargar pacientes o preguntas");
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  const manejarSeleccionPregunta = (pregunta: Pregunta) => {
    if (!preguntasSeleccionadas.find((p) => p.id === pregunta.id)) {
      setPreguntasSeleccionadas((prev) => [...prev, pregunta]);
    }
  };

  const manejarCambioRespuesta = (preguntaId: number, valor: string) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: valor,
    }));
  };

  const manejarEliminarPregunta = (preguntaId: number) => {
    setPreguntasSeleccionadas((prev) => prev.filter((p) => p.id !== preguntaId));
    setRespuestas((prev) => {
      const nuevasRespuestas = { ...prev };
      delete nuevasRespuestas[preguntaId];
      return nuevasRespuestas;
    });
    toast.info("ℹ️ Pregunta eliminada del formulario");
  };

const manejarGuardarEvaluacion = async () => {
    if (!pacienteSeleccionado) {
      toast.error("❌ Debes seleccionar un paciente antes de guardar.");
      return;
    }

    if (preguntasSeleccionadas.length === 0) {
      toast.error("❌ Debes seleccionar al menos una pregunta.");
      return;
    }

    const algunaSinRespuesta = preguntasSeleccionadas.some(
      (p) => !respuestas[p.id] || respuestas[p.id].trim() === ""
    );

    if (algunaSinRespuesta) {
      toast.error("❌ Todas las preguntas deben tener respuesta.");
      return;
    }

    const token = localStorage.getItem("token");
    const usuarioId = Number(localStorage.getItem("usuarioId"));

    const datos = {
      evaluacionId: evaluacionId ?? 0,
      usuarioId: usuarioId,
      pacienteId: pacienteSeleccionado,
      valorX: 0,
      valorY: 0,
      valorZ: 0,
      observaciones,
      respuestas: preguntasSeleccionadas.map((pregunta) => ({
        preguntaId: pregunta.id,
        valor: respuestas[pregunta.id] || "",
      })),
    };

    const endpoint = evaluacionId
      ? "/api/Evaluacion/seguimiento"
      : "/api/Evaluacion/crear";

    try {
      await api.post(endpoint, datos, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(
        evaluacionId
          ? "✅ Seguimiento guardado correctamente"
          : "✅ Evaluación creada correctamente"
      );

      const paciente = pacientes.find((p) => p.id === pacienteSeleccionado);
      const nombreCompleto = paciente ? `${paciente.nombres} ${paciente.apellidos}` : "Paciente desconocido";


      navigate("/tomaDatosClinicos", { state: { pacienteId: pacienteSeleccionado, pacienteNombre : nombreCompleto } });
    } catch (error) {
      console.error("❌ Error al guardar evaluación:", error);
      toast.error("❌ Ocurrió un error al guardar los datos");
    }
  };

  const manejarAgregarNuevaPregunta = async () => {
    if (nuevaPreguntaTexto.trim() === "") {
      toast.error("❌ La pregunta no puede estar vacía.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = [{ texto: nuevaPreguntaTexto.trim() }];

      const response = await api.post("/api/cuestionario/crearPreguntas", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const nuevasPreguntas: Pregunta[] = response.data;
      setPreguntasDisponibles((prev) => [...prev, ...nuevasPreguntas]);
      setNuevaPreguntaTexto("");
      setMostrarFormularioNuevaPregunta(false);
      toast.success("✅ Pregunta creada exitosamente");
    } catch (error) {
      console.error("Error al crear nueva pregunta", error);
      toast.error("❌ Error al crear la nueva pregunta");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-rose-700 mb-8">
          Nueva Evaluación
        </h1>

        {evaluacionId && (
          <div className="bg-yellow-100 border-l-4 border-yellow-600 text-yellow-800 p-4 rounded mb-6">
            <strong>Modo seguimiento:</strong> estás registrando un seguimiento clínico para la evaluación #{evaluacionId}.
          </div>
        )}

        {cargando ? (
          <div className="text-center text-rose-700">Cargando datos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-rose-700">1. Buscar Paciente</h2>

              <Select
                options={pacientes.map((paciente) => ({
                  value: paciente.id,
                  label: `${paciente.nombres} ${paciente.apellidos}`,
                }))}
                value={pacientes
                  .map((paciente) => ({
                    value: paciente.id,
                    label: `${paciente.nombres} ${paciente.apellidos}`,
                  }))
                  .find((opcion) => opcion.value === pacienteSeleccionado) || null}
                onChange={(opcion) => setPacienteSeleccionado(opcion?.value || null)}
                placeholder="Selecciona un paciente..."
                noOptionsMessage={() => "No se encontró ningún paciente"}
                isClearable={!pacienteId}
                isDisabled={!!pacienteId}
                className="mb-8"
              />

              <h2 className="text-xl font-semibold mb-4 text-rose-700">2. Preguntas Disponibles</h2>
              <div className="space-y-4">
                {preguntasDisponibles.map((pregunta) => (
                  <button
                    key={pregunta.id}
                    onClick={() => manejarSeleccionPregunta(pregunta)}
                    className="w-full bg-rose-100 hover:bg-rose-200 text-rose-700 font-medium py-2 px-4 rounded"
                  >
                    {pregunta.texto}
                  </button>
                ))}
              </div>

              <div className="mt-6 text-center">
                {!mostrarFormularioNuevaPregunta ? (
                  <button
                    onClick={() => setMostrarFormularioNuevaPregunta(true)}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-4 rounded"
                  >
                    ➕ Crear Nueva Pregunta
                  </button>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      value={nuevaPreguntaTexto}
                      onChange={(e) => setNuevaPreguntaTexto(e.target.value)}
                      className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-rose-500"
                      rows={3}
                      placeholder="Escribe la nueva pregunta..."
                    />
                    <div className="flex justify-between">
                      <button
                        onClick={manejarAgregarNuevaPregunta}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-4 rounded"
                      >
                        Guardar Pregunta
                      </button>
                      <button
                        onClick={() => {
                          setMostrarFormularioNuevaPregunta(false);
                          setNuevaPreguntaTexto("");
                        }}
                        className="text-rose-500 hover:text-rose-700 font-semibold py-2 px-4 rounded"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-rose-700">3. Formulario de Evaluación</h2>
              {preguntasSeleccionadas.length === 0 ? (
                <p className="text-gray-500">Selecciona preguntas para construir la evaluación.</p>
              ) : (
                <div className="space-y-6">
                  {preguntasSeleccionadas.map((pregunta) => (
                    <div key={pregunta.id} className="relative">
                      <button
                        onClick={() => manejarEliminarPregunta(pregunta.id)}
                        className="absolute top-0 right-0 text-rose-500 hover:text-rose-700 text-lg font-bold"
                        title="Eliminar esta pregunta"
                      >
                        ×
                      </button>

                      <label className="block text-gray-700 font-semibold mb-2">
                        {pregunta.texto}
                      </label>
                      <textarea
                        value={respuestas[pregunta.id] || ""}
                        onChange={(e) => manejarCambioRespuesta(pregunta.id, e.target.value)}
                        className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-rose-500 mt-2"
                        rows={3}
                        placeholder="Escribe tu respuesta..."
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Observaciones (opcional)
                </label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-rose-500"
                  rows={3}
                  placeholder="Escribe observaciones generales sobre el paciente..."
                />
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={manejarGuardarEvaluacion}
                  className="bg-rose-700 hover:bg-rose-800 text-white font-semibold py-2 px-6 rounded"
                >
                  Guardar Evaluación
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default NuevaEvaluacionPage;
