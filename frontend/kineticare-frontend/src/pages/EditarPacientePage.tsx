import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

const EditarPacientePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    id: id || "",
    nombres: "",
    apellidos: "",
    sexo: "",
    diagnostico: "",
    correoElectronico: "",
  });

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerPaciente = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/api/paciente/pacienteporid/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        setFormulario({
          id: data.id,
          nombres: data.nombres || "",
          apellidos: data.apellidos || "",
          sexo: data.sexo || "",
          diagnostico: data.diagnostico || "",
          correoElectronico: data.correoElectronico || "",
        });
      } catch (error) {
        console.error("❌ Error al obtener paciente:", error);
        toast.error("Error al cargar datos del paciente");
      } finally {
        setCargando(false);
      }
    };

    obtenerPaciente();
  }, [id]);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const manejarGuardar = async () => {
    const { nombres, apellidos, sexo, diagnostico, correoElectronico } = formulario;

    if (!nombres || !apellidos || !sexo || !diagnostico || !correoElectronico) {
      toast.error("❌ Todos los campos son obligatorios");
      return;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correoElectronico)) {
      toast.error("❌ Correo electrónico inválido");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const fisioterapeutaId = localStorage.getItem("usuarioId"); // ✅ aquí recuperamos el fisioterapeutaId

      const payload = {
        id: Number(id),
        nombres,
        apellidos,
        sexo,
        diagnostico,
        correoElectronico,
        fisioterapeutaId: Number(fisioterapeutaId), // ✅ se envía explícitamente
      };

      await api.put(`/api/Paciente/actualizarPaciente/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Paciente actualizado correctamente");
      navigate("/evaluaciones/verPacientes");
    } catch (error) {
      console.error("❌ Error al actualizar paciente:", error);
      toast.error("Error al actualizar paciente");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header userId={localStorage.getItem("usuarioId") || "0"} tipo="Usuario" />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-udla-red text-center mb-8">Editar Paciente</h1>

        {cargando ? (
          <p className="text-center text-gray-600">Cargando información...</p>
        ) : (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-6">
            <div>
              <label className="block font-semibold mb-1">Nombres</label>
              <input
                type="text"
                name="nombres"
                value={formulario.nombres}
                onChange={manejarCambio}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Apellidos</label>
              <input
                type="text"
                name="apellidos"
                value={formulario.apellidos}
                onChange={manejarCambio}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Sexo</label>
              <select
                name="sexo"
                value={formulario.sexo}
                onChange={manejarCambio}
                className="w-full border rounded p-2"
              >
                <option value="">Seleccione</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Diagnóstico</label>
              <input
                type="text"
                name="diagnostico"
                value={formulario.diagnostico}
                onChange={manejarCambio}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Correo electrónico</label>
              <input
                type="email"
                name="correoElectronico"
                value={formulario.correoElectronico}
                onChange={manejarCambio}
                className="w-full border rounded p-2"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={manejarGuardar}
                className="bg-udla-red text-white px-6 py-2 rounded hover:bg-red-700 transition"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default EditarPacientePage;
