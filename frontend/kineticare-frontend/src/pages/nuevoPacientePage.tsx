import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NuevoPacientePage = () => {
  const navigate = useNavigate();

  const usuarioId = localStorage.getItem("usuarioId");
  const nombreUsuario = localStorage.getItem("nombreUsuario");

  const [formulario, setFormulario] = useState({
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    sexo: "",
    diagnostico: "",
    correoElectronico: "", // ✅ nuevo campo
    fisioterapeutaId: parseInt(usuarioId || "0"),
  });

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const manejarGuardarPaciente = async () => {
    const { nombres, apellidos, fechaNacimiento, sexo, diagnostico, correoElectronico } = formulario;

    // Validación de campos obligatorios
    if (!nombres || !apellidos || !fechaNacimiento || !sexo || !diagnostico || !correoElectronico) {
      toast.error("❌ Todos los campos son obligatorios");
      return;
    }

    // Validación del formato de correo electrónico
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correoElectronico)) {
      toast.error("❌ El correo electrónico no es válido");
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
      <Header
        userId={localStorage.getItem("userId") || ""}
        tipo={(localStorage.getItem("Usuario") as "Usuario" | "Paciente") || "Usuario"}
      />

      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-rose-700 mb-8">
          Registro de Nuevo Paciente
        </h1>

        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
          {/* Nombres */}
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

          {/* Apellidos */}
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

          {/* Fecha de nacimiento */}
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

          {/* Sexo */}
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

          {/* Diagnóstico */}
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

          {/* Correo electrónico */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Correo electrónico</label>
            <input
              type="email"
              name="correoElectronico"
              value={formulario.correoElectronico}
              onChange={manejarCambio}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-rose-500"
              placeholder="Ingrese el correo electrónico"
            />
          </div>

          {/* Fisioterapeuta asignado (solo visible, no editable) */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Fisioterapeuta asignado</label>
            <input
              type="text"
              value={nombreUsuario || ""}
              disabled
              className="w-full border rounded-md p-2 bg-gray-100 text-gray-700"
            />
          </div>

          {/* Botón */}
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
