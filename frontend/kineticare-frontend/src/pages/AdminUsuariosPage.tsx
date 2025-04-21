import { useEffect, useState } from "react";
import api from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<any | null>(null);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<any | null>(null);

  const abrirModalEdicion = (usuario: any) => {
    setUsuarioEditando(usuario);
    setModalAbierto(true);
  };

  const guardarCambios = async () => {
    if (!usuarioEditando) return;

    if (!usuarioEditando.nombre || usuarioEditando.nombre.trim() === "") {
      toast.error("El nombre no puede estar vacío");
      return;
    }

    if (!usuarioEditando.correo || !usuarioEditando.correo.includes("@")) {
      toast.error("El correo ingresado no es válido");
      return;
    }

    if (!usuarioEditando.rolId) {
      toast.error("Debe seleccionar un rol válido");
      return;
    }

    try {
      const dto = {
        id: usuarioEditando.id,
        nombre: usuarioEditando.nombre,
        correo: usuarioEditando.correo,
        rolId: usuarioEditando.rolId,
        activo: usuarioEditando.activo ?? true,
      };

      await api.put(`/api/auth/edit`, dto);

      const obtenerRolName = (rolId: number) => {
        switch (rolId) {
          case 1: return "Administrador";
          case 2: return "Fisioterapeuta";
          case 3: return "Paciente";
          default: return "Desconocido";
        }
      };

      const usuarioActualizado = {
        ...usuarioEditando,
        ...dto,
        rolName: obtenerRolName(dto.rolId),
      };

      const actualizados = usuarios.map((u: any) =>
        u.id === usuarioActualizado.id ? usuarioActualizado : u
      );
      setUsuarios(actualizados);

      setModalAbierto(false);
      setUsuarioEditando(null);

      toast.success("✅ Usuario actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      toast.error("❌ Ocurrió un error al guardar los cambios");
    }
  };

  const eliminarUsuario = async () => {
    if (!usuarioAEliminar) return;

    try {
      await api.delete(`/api/auth/${usuarioAEliminar.id}`);
      setUsuarios(usuarios.filter((u: any) => u.id !== usuarioAEliminar.id));
      toast.success("✅ Usuario eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      toast.error("❌ Ocurrió un error al eliminar el usuario");
    } finally {
      setModalEliminarAbierto(false);
      setUsuarioAEliminar(null);
    }
  };

  const activarUsuario = async (usuario: any) => {
    try {
      const dto = { ...usuario, activo: true };
      await api.put(`/api/auth/edit`, dto);
      const actualizados = usuarios.map((u: any) =>
        u.id === usuario.id ? { ...u, activo: true } : u
      );
      setUsuarios(actualizados);
      toast.success("✅ Usuario activado correctamente");
    } catch (error) {
      console.error("Error al activar usuario:", error);
      toast.error("❌ Ocurrió un error al activar el usuario");
    }
  };

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get("/api/auth/usuarios");
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter((u: any) =>
    u.activo === !mostrarInactivos &&
    (
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-udla-light flex flex-col">
      {/* Modales de edición y eliminación omitidos por brevedad */}
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-udla-red mb-4">Gestión de usuarios</h1>

        <div className="flex flex-wrap gap-2 mb-2">
          <button
            className={`px-4 py-2 rounded ${
              !mostrarInactivos ? 'bg-udla-red text-white' : 'bg-gray-200 text-black'
            }`}
            onClick={() => setMostrarInactivos(false)}
          >Usuarios activos</button>

          <button
            className={`px-4 py-2 rounded ${
              mostrarInactivos ? 'bg-udla-red text-white' : 'bg-gray-200 text-black'
            }`}
            onClick={() => setMostrarInactivos(true)}
          >Usuarios inactivos</button>
        </div>

        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            className="w-full md:w-1/2 p-2 border rounded-md"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <a href="/register" className="bg-udla-red text-white px-4 py-2 rounded-2xl hover:bg-red-700 transition">
            + Nuevo Usuario
          </a>
        </div>

        {loading ? (
          <p>Cargando usuarios...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-udla-red text-white">
                  <th className="text-left p-3">Nombre</th>
                  <th className="text-left p-3">Correo</th>
                  <th className="text-left p-3">Rol</th>
                  <th className="text-left p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario: any, index: number) => (
                  <tr key={usuario.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="p-3">{usuario.nombre}</td>
                    <td className="p-3">{usuario.correo}</td>
                    <td className="p-3">{usuario.rolName}</td>
                    <td className="p-3 space-x-2 flex">
                      {!mostrarInactivos ? (
                        <>
                          <button
                            onClick={() => abrirModalEdicion(usuario)}
                            className="flex items-center gap-1 bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-lg hover:bg-blue-200 transition"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => {
                              setUsuarioAEliminar(usuario);
                              setModalEliminarAbierto(true);
                            }}
                            className="flex items-center gap-1 bg-red-100 text-red-800 font-medium px-3 py-1 rounded-lg hover:bg-red-200 transition"
                          >
                            🗑️ Eliminar
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => activarUsuario(usuario)}
                          className="flex items-center gap-1 bg-green-100 text-green-800 font-medium px-3 py-1 rounded-lg hover:bg-green-200 transition"
                        >
                          ✅ Activar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default AdminUsuariosPage;
