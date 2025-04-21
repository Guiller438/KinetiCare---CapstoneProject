import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import udlaLogo from "../assets/udla-logo-negro.png";

type RegisterFormInputs = {
  nombre: string;
  correo: string;
  contrasena: string;
  rolId: string; // se convertirá a número
};

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();
  const [registerError, setRegisterError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await api.post("api/auth/register", {
        nombre: data.nombre,
        correo: data.correo,
        contrasena: data.contrasena,
        rolId: parseInt(data.rolId),
      });

      setRegisterError("");
      navigate("/"); // Redirige al login
    } catch (error: any) {
      setRegisterError("Error al registrar el usuario. Intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen bg-udla-light flex flex-col items-center justify-center px-4">
      <div className="mb-6">
        <img src={udlaLogo} alt="Logo UDLA" className="h-20" />
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-center text-2xl font-bold text-udla-red mb-6">
          Crear cuenta en KinetiCare
        </h2>

        {registerError && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {registerError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-udla-black font-semibold mb-1">Nombre completo</label>
            <input
              type="text"
              {...register("nombre", { required: true })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-udla-red"
            />
            {errors.nombre && (
              <p className="text-sm text-red-500 mt-1">El nombre es obligatorio.</p>
            )}
          </div>

          <div>
            <label className="block text-udla-black font-semibold mb-1">Correo electrónico</label>
            <input
              type="email"
              {...register("correo", { required: true })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-udla-red"
            />
            {errors.correo && (
              <p className="text-sm text-red-500 mt-1">El correo es obligatorio.</p>
            )}
          </div>

          <div>
            <label className="block text-udla-black font-semibold mb-1">Contraseña</label>
            <input
              type="password"
              {...register("contrasena", { required: true })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-udla-red"
            />
            {errors.contrasena && (
              <p className="text-sm text-red-500 mt-1">La contraseña es obligatoria.</p>
            )}
          </div>

          <div>
            <label className="block text-udla-black font-semibold mb-1">Rol</label>
            <select
              {...register("rolId", { required: true })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-udla-red"
            >
              <option value="">Selecciona un rol</option>
              <option value="1">Administrador</option>
              <option value="2">Fisioterapeuta</option>
              <option value="3">Paciente</option>
            </select>
            {errors.rolId && (
              <p className="text-sm text-red-500 mt-1">Debes seleccionar un rol.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-udla-red text-white font-semibold py-2 rounded-md hover:bg-red-700 transition"
          >
            Registrar cuenta
          </button>
        </form>

        <p className="text-center text-sm text-udla-gray mt-4">
          ¿Ya tienes una cuenta?{" "}
          <a href="/" className="text-udla-red hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
