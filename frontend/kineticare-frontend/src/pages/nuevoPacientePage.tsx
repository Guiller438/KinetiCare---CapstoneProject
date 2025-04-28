import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Select from "react-select"; // ✅ Agregado react-select

interface Fisioterapeuta {
  id: number;
  nombre: string;
}

const NuevoPacientePage = () => {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    sexo: "",
    diagnostico: "",
    fisioterapeutaId: 0,
  });

  const [fisioterapeutas, setFisioterapeutas] = useState<Fisioterapeuta[]>([]);

  useEffect(() => {
    const cargarFisioterapeutas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/api/auth/fisioterapeutas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFisioterapeutas(response.data);
      } catch (error) {
        console.error("Error al cargar fisioterapeutas", error);
        toast.error("❌ Error al cargar fisioterapeutas");
      }
    };

    cargarFisioterapeutas();
  }, []);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  };

  const manejarGuardarPaciente = async () => {
    if (!formulario.nombres || !formulario.apellidos || !formulario.fechaNacimiento || !formulario.sexo || !formulario.diagnostico) {
      toast.error("❌ Todos los campos son obligatorios");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.post("/api/paciente/crearPaciente", formulario, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Paciente registrado exitosamente");
      navigate("/menuevaluacion");
    } catch (error) {
      console.error("Error al crear paciente", error);
      toast.error("❌ Error al registrar el paciente");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-rose-700 mb-8">
          Registro de Nuevo Paciente
        </h1>

        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Nombres</label>
            <input
              type="text"
              name="nombres"
              value={formulario.nombres}
              onChange={manejarCambio}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-rose-500"
              placeholder="Ingrese los nombres"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Apellidos</label>
            <input
              type="text"
              name="apellidos"
              value={formulario.apellidos}
              onChange={manejarCambio}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-rose-500"
              placeholder="Ingrese los apellidos"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Fecha de Nacimiento</label>
            <input
              type="date"
              name="fechaNacimiento"
              value={formulario.fechaNacimiento}
              onChange={manejarCambio}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Sexo</label>
            <select
              name="sexo"
              value={formulario.sexo}
              onChange={manejarCambio}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-rose-500"
            >
              <option value="">Seleccione</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Diagnóstico</label>
            <input
              type="text"
              name="diagnostico"
              value={formulario.diagnostico}
              onChange={manejarCambio}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-rose-500"
              placeholder="Ingrese el diagnóstico"
            />
          </div>

          {/* 🔥 CAMBIO: Fisioterapeuta con Select y buscador */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Fisioterapeuta</label>
            <Select
              options={fisioterapeutas.map((fisio) => ({
                value: fisio.id,
                label: `${fisio.nombre} `,
              }))}
              value={fisioterapeutas
                .map((fisio) => ({
                  value: fisio.id,
                  label: `${fisio.nombre}`,
                }))
                .find((opcion) => opcion.value === formulario.fisioterapeutaId) || null}
              onChange={(opcion) => setFormulario(prev => ({
                ...prev,
                fisioterapeutaId: opcion?.value || 0,
              }))}
              placeholder="Seleccione un fisioterapeuta..."
              noOptionsMessage={() => "No se encontró ningún fisioterapeuta"}
              isClearable
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={manejarGuardarPaciente}
              className="bg-rose-700 hover:bg-rose-800 text-white font-semibold py-2 px-6 rounded"
            >
              Registrar Paciente
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NuevoPacientePage;
