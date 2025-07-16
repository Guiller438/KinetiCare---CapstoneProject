import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../services/api";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";

interface Paciente {
  id: number;
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
  ocupado?: boolean;
}

type OptionType = {
  value: number;
  label: string;
};

function AgendarCitaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pacienteId: pacienteIdDesdeOtraPantalla } = location.state || {};

  const fisioterapeutaId = parseInt(localStorage.getItem("usuarioId") || "0");
  const nombreFisioterapeuta = localStorage.getItem("usuarioNombre") || "Fisioterapeuta";

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<OptionType | null>(null);
  const [fecha, setFecha] = useState<string>("");
  const [subBloques, setSubBloques] = useState<SubBloque[]>([]);
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState<SubBloque | null>(null);
  const [observacion, setObservacion] = useState<string>("");

  const cargarPacientes = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("No se encontró el token. Vuelve a iniciar sesión.");
        return;
      }

      const response = await api.get(`/api/Paciente/pacienteporfisioterapeuta/${fisioterapeutaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPacientes(response.data);
    } catch (error) {
      toast.error("Error al cargar pacientes");
      console.error(error);
    }
  };


  const cargarSubBloques = async () => {
    if (!fecha) return;

    const fechaObj = new Date(fecha + "T00:00:00");
    const diaSemana = fechaObj.getDay();

    try {
      const response = await api.get(`/api/Disponibilidad/fisioterapeuta/${fisioterapeutaId}`);
      const disponibilidades: Disponibilidad[] = response.data;
      const bloquesDia = disponibilidades.filter((d) => d.diaSemana === diaSemana);

      const nuevosSubBloques: SubBloque[] = [];

      for (const bloque of bloquesDia) {
        const inicio = parseHora(bloque.horaInicio);
        const fin = parseHora(bloque.horaFin);

        let actual = new Date(inicio);
        while (actual < fin) {
          const siguiente = new Date(actual.getTime() + 60 * 60 * 1000);
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

      const ocupadasResp = await api.get("/api/Citas/ocupadas", {
        params: {
          fisioterapeutaId,
          fecha: fecha + "T00:00:00",
        },
      });

      const horasOcupadas: string[] = ocupadasResp.data.map((d: string) => {
        const date = new Date(d);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const hh = String(date.getHours()).padStart(2, "0");
        const min = String(date.getMinutes()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
      });

      const subBloquesFinales = nuevosSubBloques.map((b) => {
        const bloqueStr = `${fecha}T${b.horaInicioReal}`;
        return {
          ...b,
          ocupado: horasOcupadas.includes(bloqueStr),
        };
      });

      setSubBloques(subBloquesFinales);
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

  const formatHora = (date: Date) => date.toTimeString().substring(0, 5);

  const pacienteOptions: OptionType[] = pacientes.map((paciente) => ({
    value: paciente.id,
    label: `${paciente.nombres} ${paciente.apellidos}`,
  }));

  useEffect(() => {
    cargarPacientes();
  }, []);

  useEffect(() => {
    cargarSubBloques();
  }, [fecha]);

  useEffect(() => {
    if (!pacienteIdDesdeOtraPantalla || pacientes.length === 0) return;

    const pacienteEncontrado = pacientes.find((p) => p.id === pacienteIdDesdeOtraPantalla);
    if (pacienteEncontrado) {
      const option: OptionType = {
        value: pacienteEncontrado.id,
        label: `${pacienteEncontrado.nombres} ${pacienteEncontrado.apellidos}`,
      };
      setPacienteSeleccionado(option);
    }
  }, [pacienteIdDesdeOtraPantalla, pacientes]);

  const agendarCita = async () => {
    if (!pacienteSeleccionado || !fecha || !bloqueSeleccionado || bloqueSeleccionado.ocupado) {
      toast.warning("Completa todos los campos correctamente");
      return;
    }

    const fechaHoraCita = `${fecha}T${bloqueSeleccionado.horaInicioReal}:00`;

    const nuevaCita = {
      fisioterapeutaId,
      pacienteId: pacienteSeleccionado.value,
      fechaHora: fechaHoraCita,
      observaciones: observacion,
    };

    try {
      await api.post("/api/Citas", nuevaCita);
      toast.success("Cita agendada con éxito");

      const fechaFormateada = new Date(fechaHoraCita).toLocaleDateString("es-EC", { day: '2-digit', month: '2-digit', year: 'numeric' });
      const horaFormateada = new Date(fechaHoraCita).toLocaleTimeString("es-EC", { hour: '2-digit', minute: '2-digit' });

      // WhatsApp
      const notificacionDTO = {
        nombrePaciente: pacienteSeleccionado.label,
        nombreFisioterapeuta,
        fechaCita: fechaHoraCita,
        numeroDestino: "+593998567371"
      };

      await fetch("http://localhost:5010/api/whatsapp/enviar-cita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notificacionDTO)
      });

      // Notificación interna usando API centralizado:
    await api.post("/api/Notification/enviar", null, {
      params: {
        receptorId: fisioterapeutaId,
        tipo: "Usuario",
        titulo: "Recordatorio Cita",
        mensaje: `Hola ${nombreFisioterapeuta}, recuerda tu cita el ${fechaFormateada} a las ${horaFormateada} con ${pacienteSeleccionado.label}`
      }
    });

      // Notificación interna
      await fetch(`http://localhost:5010/api/Notification/enviar?receptorId=${pacienteSeleccionado.value}&tipo=Usuario&titulo=Recordatorio Cita&mensaje=Hola ${pacienteSeleccionado.label}, recuerda tu cita el ${fechaFormateada} a las ${horaFormateada} con ${nombreFisioterapeuta}`, {
        method: "POST"
      });

      navigate("/home");
    } catch (error: any) {
      toast.error("El fisioterapeuta ya tiene una cita agendada en ese horario");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header userId={fisioterapeutaId.toString()} tipo="Usuario" />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Agendar Cita</h2>

        <div className="bg-white shadow rounded p-6 space-y-4">
          <div>
            <label className="block font-semibold mb-1">Paciente:</label>
            <Select
              options={pacienteOptions}
              value={pacienteSeleccionado}
              onChange={(opcion) => setPacienteSeleccionado(opcion)}
              placeholder="Selecciona un paciente..."
              noOptionsMessage={() => "No se encontró ningún paciente"}
              isClearable
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Fecha:</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

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
                    disabled={b.ocupado}
                    title={b.ocupado ? "Este horario ya está agendado" : ""}
                    className={`px-3 py-2 border rounded transition text-sm ${
                      seleccionado
                        ? "bg-[#c8102e] text-white"
                        : b.ocupado
                        ? "bg-gray-200 text-gray-500 line-through cursor-not-allowed"
                        : "bg-[#f4f4f4] text-black hover:bg-gray-200"
                    }`}
                    onClick={() => !b.ocupado && setBloqueSeleccionado(b)}
                  >
                    {b.horaInicioReal} - {b.horaFinReal}
                  </button>
                );
              })}
            </div>
          </div>

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
