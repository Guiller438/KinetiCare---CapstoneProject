import udlaLogo from "../assets/udla-logo-negro.png";
import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";


type LoginFormInputs = {
  correo: string;
  contrasena: string;
};

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await api.post("api/auth/Login", {
        correo: data.correo,
        contrasena: data.contrasena,
      });

      const token = response.data.token;
      const rolName = response.data.rol;

      localStorage.setItem("token", token);
      localStorage.setItem("rol", rolName); // <--- debe ser el nombre del rol

      setLoginError("");

      // Redirigir al dashboard o ruta protegida
      navigate("/home");
    } catch (error: any) {
      setLoginError("Credenciales incorrectas o error de conexión.");
    }
  };

  return (
    <div className="min-h-screen bg-udla-light flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-6">
        <img src={udlaLogo} alt="Logo UDLA" className="h-20" />
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-center text-2xl font-bold text-udla-red mb-6">
          Iniciar sesión en KinetiCare
        </h2>

        {/* Error de login */}
        {loginError && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-udla-black font-semibold mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="usuario@udla.edu.ec"
              {...register("correo", { required: true })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-udla-red"
            />
            {errors.correo && (
              <p className="text-sm text-red-500 mt-1">El correo es obligatorio.</p>
            )}
          </div>

          <div>
            <label className="block text-udla-black font-semibold mb-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("contrasena", { required: true })}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-udla-red"
            />
            {errors.contrasena && (
              <p className="text-sm text-red-500 mt-1">La contraseña es obligatoria.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-udla-red text-white font-semibold py-2 rounded-md hover:bg-red-700 transition"
          >
            Ingresar
          </button>
        </form>

        <p className="text-center text-sm text-udla-gray mt-4">
          ¿Olvidaste tu contraseña?{" "}
          <a href="/reset-password" className="text-udla-red hover:underline">
            Recuperar acceso
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
