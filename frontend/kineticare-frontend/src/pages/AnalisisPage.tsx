import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from "../components/Header";
import Footer from "../components/Footer";
import RecomendacionesEditor from "../components/RecomendacionesEditor";
import ValoresAnomalos from "../components/ValoresAnomalos";

const AnalisisPage: React.FC = () => {
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<string>('');
  const [recomendaciones, setRecomendaciones] = useState({
    ejercicio1: '',
    ejercicio2: '',
    frecuencia: '',
    observaciones: '',
  });

  const [anomalos, setAnomalos] = useState({ x: 0, y: 0, z: 0 });

  const fisioterapeutaId = localStorage.getItem("usuarioId");
  const token = localStorage.getItem("token");

  console.log("🧑‍⚕️ ID del fisioterapeuta:", fisioterapeutaId);
  console.log("🔐 Token actual:", token);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const url = `http://172.31.56.69:7000/api/Paciente/pacienteporfisioterapeuta/${fisioterapeutaId}`;
        console.log("🌐 Consultando:", url);

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("📥 Respuesta cruda:", response.data);

        if (Array.isArray(response.data)) {
          console.log("✅ Pacientes recibidos como array directo");
          setPacientes(response.data);
        } else if (Array.isArray(response.data.pacientes)) {
          console.log("✅ Pacientes recibidos en propiedad 'pacientes'");
          setPacientes(response.data.pacientes);
        } else {
          console.warn("⚠️ No se recibió un array de pacientes válido.");
          setPacientes([]);
        }
      } catch (error: any) {
        console.error("❌ Error al obtener pacientes:", error);
        setPacientes([]);
      }
    };

    fetchPacientes();
  }, [fisioterapeutaId, token]);

  const generarRecomendaciones = () => {
    const ejercicios = [
      "Flexión de rodilla asistida (3x15)",
      "Estiramiento isquiotibial en camilla (2x20s)",
      "Elevación de talones (3x20)",
      "Extensión de cadera con banda elástica (2x15)",
      "Sentadillas parciales (3x10)"
    ];

    const frecuencias = [
      "2 veces por semana",
      "3 veces por semana",
      "Días alternos",
      "Todos los días",
    ];

    const observaciones = [
      "Mantener reposo los fines de semana",
      "Hacer los ejercicios en la mañana",
      "Supervisar el dolor al realizarlos",
      "Acompañar con terapia de calor local",
    ];

    const nuevaRecomendacion = {
      ejercicio1: ejercicios[Math.floor(Math.random() * ejercicios.length)],
      ejercicio2: ejercicios[Math.floor(Math.random() * ejercicios.length)],
      frecuencia: frecuencias[Math.floor(Math.random() * frecuencias.length)],
      observaciones: "Observaciones: " + observaciones[Math.floor(Math.random() * observaciones.length)],
    };

    setRecomendaciones(nuevaRecomendacion);
  };

  const generarValoresAnomalos = () => {
    return {
      x: Math.random() * 5 + 3, // 3.00 - 8.00
      y: Math.random() * 4 + 2, // 2.00 - 6.00
      z: Math.random() * 6 + 1, // 1.00 - 7.00
    };
  };

  const handleEnviar = (datos: typeof recomendaciones) => {
    console.log("✉️ Tratamiento a enviar:", datos, "📌 Para el paciente:", pacienteSeleccionado);
    alert("✅ Tratamiento simulado enviado al paciente");
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header userId={""} tipo={"Usuario"} />

      <div style={{
        backgroundColor: '#fff',
        color: '#C8102E',
        padding: '1.5rem 2rem',
        textAlign: 'center',
        borderBottom: '4px solid #C8102E',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
          Análisis del Movimiento Funcional
        </h1>
        <p style={{ marginTop: '0.5rem', color: '#333' }}>
          Visualización de los datos capturados en KinetiCare mediante Power BI.
        </p>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', padding: '2rem', gap: '2rem' }}>
        <div style={{ flex: 3 }}>
          <iframe
            title="AnálisisDelMovimiento"
            width="100%"
            height="750px"
            src="https://app.powerbi.com/view?r=eyJrIjoiYjRkNDQ4NWMtMjQ5ZS00Y2EwLWE2MGUtMDdhZmQ0Y2RhYmU5IiwidCI6IjU4NWE0ZDkyLWRiMWQtNGJiYi1iNWFjLWM1Mjk5ZTM4OTRlMyIsImMiOjR9"
            frameBorder="0"
            allowFullScreen
            style={{ border: 'none', borderRadius: '10px' }}
          ></iframe>

          <ValoresAnomalos valores={anomalos} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: 'bold' }}>Seleccionar paciente:</label>
            <select
              value={pacienteSeleccionado}
              onChange={(e) => {
                setPacienteSeleccionado(e.target.value);
                generarRecomendaciones();
                setAnomalos(generarValoresAnomalos());
              }}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', marginTop: '0.5rem' }}
            >
              <option value="">-- Selecciona un paciente --</option>
              {Array.isArray(pacientes) && pacientes.length > 0 ? (
                pacientes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombres} {p.apellidos}
                  </option>
                ))
              ) : (
                <option disabled>No hay pacientes disponibles</option>
              )}
            </select>
          </div>

          <RecomendacionesEditor recomendaciones={recomendaciones} onEnviar={handleEnviar} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AnalisisPage;
