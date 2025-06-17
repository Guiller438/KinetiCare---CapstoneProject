import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

interface Paciente {
  pacienteId: number;
  nombres: string;
  apellidos: string;
}

interface Disponibilidad {
  disponibilidadId: number;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
}

interface SubBloque {
  disponibilidadId: number;
  horaInicioReal: string;
  horaFinReal: string;
}

type OptionType = {
  value: number;
  label: string;
};

function AgendarCitaPage() {
  const navigate = useNavigate();
  const fisioterapeutaId = parseInt(localStorage.getItem("usuarioId") || "0");

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteId, setPacienteId] = useState<number | null>(null);
  const [fecha, setFecha] = useState<string>("");
  const [subBloques, setSubBloques] = useState<SubBloque[]>([]);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<SubBloque | null>(null);
  const [observacion, setObservacion] = useState<string>("");

  const cargarPacientes = async () => {
    try {
      const response = await api.get("/api/paciente/obtenerPacientes");
      setPacientes(response.data);
    } catch (error) {
      toast.error("Error al cargar pacientes");
    }
  };

  const cargarSubBloques = async () => {
    if (!fecha) return;
    const fechaObj = new Date(fecha);
    const diaSemana = fechaObj.getDay();

    try {
      const response = await api.get(`/api/Disponibilidad/fisioterapeuta/${fisioterapeutaId}`);
      const disponibilidades: Disponibilidad[] = response.data;
      const bloquesDia = disponibilidades.filter(d => d.diaSemana === diaSemana);

      const nuevosSubBloques: SubBloque[] = [];

      for (const bloque of bloquesDia) {
        const inicio = parseHora(bloque.horaInicio);
        const fin = parseHora(bloque.horaFin);

        let actual = new Date(inicio);
        while (actual < fin) {
          const siguiente = new Date(actual.getTime() + 60 * 60 * 1000); // 1 hora
          if (siguiente <= fin) {
            nuevosSubBloques.push({
              disponibilidadId: bloque.disponibilidadId,
              horaInicioReal: formatHora(actual),
              horaFinReal: formatHora(siguiente),
            });
          }
          actual = siguiente;
        }
      }

      setSubBloques(nuevosSubBloques);
    } catch (error) {
      toast.error("Error al cargar disponibilidad");
    }
  };

  const parseHora = (hora: string) => {
    const [h, m] = hora.split(":").map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    return date;
  };

  const formatHora = (date: Date) =>
    date.toTimeString().substring(0, 5);

  const agendarCita = async () => {
    console.log("PacienteId:", pacienteId, "Fecha:", fecha, "Bloque:", bloqueSeleccionado);

    if (!pacienteId || !fecha || !bloqueSeleccionado) {
      toast.warning("Completa todos los campos");
      return;
    }

    const fechaCita = new Date(`${fecha}T${bloqueSeleccionado.horaInicioReal}`);

    const nuevaCita = {
      fisioterapeutaId,
      pacienteId,
      fechaHora: fechaCita.toISOString(),
      observacion,
    };

    try {
      await api.post("/api/Cita", nuevaCita);
      toast.success("Cita agendada con éxito");
      navigate("/home");
    } catch (error) {
      toast.error("Error al agendar la cita");
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  useEffect(() => {
    cargarSubBloques();
  }, [fecha]);

  const pacienteOptions: OptionType[] = pacientes.map((p) => ({
    value: p.pacienteId,
    label: `${p.nombres} ${p.apellidos}`,
  }));

  const selectedPaciente = pacienteOptions.find((op) => op.value === pacienteId) || null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Agendar Cita</h2>

        <div className="bg-white shadow rounded p-6 space-y-4">
          {/* Paciente */}
          <div>
            <label className="block font-semibold mb-1">Paciente:</label>
            <Select
              options={pacienteOptions}
              value={selectedPaciente}
              onChange={(op: OptionType | null) => {
                if (op) {
                  setPacienteId(op.value);
                } else {
                  setPacienteId(null);
                }
              }}
              placeholder="Selecciona un paciente..."
            />
          </div>

          {/* Fecha */}
          <div>
            <label className="block font-semibold mb-1">Fecha:</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          {/* Sub-bloques disponibles */}
          <div>
            <label className="block font-semibold mb-1">Horarios disponibles:</label>
            <div className="flex flex-wrap gap-2">
              {subBloques.length === 0 && <p>No hay bloques disponibles para esa fecha.</p>}
              {subBloques.map((b, idx) => {
                const seleccionado =
                  bloqueSeleccionado?.horaInicioReal === b.horaInicioReal &&
                  bloqueSeleccionado?.horaFinReal === b.horaFinReal;

                return (
                  <button
                    key={idx}
                    className={`px-3 py-2 border rounded transition ${
                      seleccionado
                        ? 'bg-[#c8102e] text-white'
                        : 'bg-[#f4f4f4] text-black hover:bg-gray-200'
                    }`}
                    onClick={() => setBloqueSeleccionado(b)}
                  >
                    {b.horaInicioReal} - {b.horaFinReal}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Observación */}
          <div>
            <label className="block font-semibold mb-1">Observación:</label>
            <textarea
              className="w-full p-2 border rounded"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              rows={3}
              placeholder="Observaciones relevantes para la cita (opcional)..."
            ></textarea>
          </div>

          {/* Botón agendar */}
          <div className="pt-4">
            <button
              onClick={agendarCita}
              className="bg-[#c8102e] hover:bg-red-800 text-white px-6 py-2 rounded"
            >
              Agendar Cita
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AgendarCitaPage;
