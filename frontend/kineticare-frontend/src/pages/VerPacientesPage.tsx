import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

interface Paciente {
  id: number;
  nombres: string;
  apellidos: string;
  sexo: string;
  diagnostico: string;
  edad: number;
  correoElectronico: string | null;
}

const VerPacientesPage: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [filtro, setFiltro] = useState<string>("");
  const navigate = useNavigate();

  const cargarPacientes = async () => {
    try {
      const token = localStorage.getItem("token");
      const usuarioId = localStorage.getItem("usuarioId");

      const response = await api.get(`/api/Paciente/pacienteporfisioterapeuta/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPacientes(response.data);
    } catch (error) {
      console.error("Error al cargar pacientes:", error);
      toast.error("❌ Error al cargar pacientes");
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  const manejarEliminar = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este paciente?")) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/api/Paciente/eliminar/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("✅ Paciente eliminado exitosamente");
      cargarPacientes();
    } catch (error) {
      console.error("Error al eliminar paciente:", error);
      toast.error("❌ No se pudo eliminar el paciente");
    }
  };

  const manejarEditar = (id: number) => {
    navigate(`/editarPaciente/${id}`);
  };

  const pacientesFiltrados = pacientes.filter((p) =>
    `${p.nombres} ${p.apellidos} ${p.diagnostico} ${p.correoElectronico ?? ""}`
      .toLowerCase()
      .includes(filtro.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        userId={localStorage.getItem("usuarioId") || ""}
        tipo="Usuario"
      />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-center text-rose-700 mb-6">
          Mis Pacientes Registrados
        </h1>

        <input
          type="text"
          placeholder="Buscar por nombre, diagnóstico o correo..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full md:w-1/2 mb-6 p-3 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:border-rose-500"
        />

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded shadow-md">
            <thead className="bg-udla-red text-white">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Sexo</th>
                <th className="px-4 py-3 text-left">Diagnóstico</th>
                <th className="px-4 py-3 text-left">Edad</th>
                <th className="px-4 py-3 text-left">Correo Electrónico</th>
                <th className="px-4 py-3 text-left">Acciones</th>
                <th className="px-4 py-3 text-left">Evaluar</th>
              </tr>
            </thead>
            <tbody>
              {pacientesFiltrados.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{p.nombres} {p.apellidos}</td>
                  <td className="px-4 py-3">{p.sexo === "M" ? "Masculino" : "Femenino"}</td>
                  <td className="px-4 py-3">{p.diagnostico}</td>
                  <td className="px-4 py-3">{p.edad} años</td>
                  <td className="px-4 py-3">{p.correoElectronico || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => manejarEditar(p.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => manejarEliminar(p.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        🗑 Eliminar
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate("/evaluaciones/nueva", {
                        state: { pacienteId: p.id }
                      })}
                      className="bg-udla-red hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm"
                    >
                      ➕ Nueva Evaluación
                    </button>
                  </td>
                </tr>
              ))}
              {pacientesFiltrados.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                    No se encontraron pacientes con ese criterio.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VerPacientesPage;
