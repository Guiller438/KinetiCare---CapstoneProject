import udlaLogo from "../assets/udla-logo-blanco.png";
import videoFondo from "../assets/udla.mp4";
import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeOff } from "lucide-react";

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
  const [verPassword, setVerPassword] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await api.post("api/auth/Login", {
        correo: data.correo,
        contrasena: data.contrasena,
      });

      const token = response.data.token;
      const rolName = response.data.rol;
      const nombreUsuario = response.data.nombre;

      const decoded: any = jwtDecode(token);
      const usuarioId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

      localStorage.setItem("token", token);
      localStorage.setItem("rol", rolName);
      localStorage.setItem("usuarioId", usuarioId);
      localStorage.setItem("nombreUsuario", nombreUsuario);

      setLoginError("");
      navigate("/home");
    } catch (error: any) {
      setLoginError("Credenciales incorrectas o error de conexión.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* 🎥 Video de fondo */}
      <video className="absolute top-0 left-0 w-full h-full object-cover z-0" autoPlay loop muted>
        <source src={videoFondo} type="video/mp4" />
        Tu navegador no soporta el video.
      </video>

      {/* Fondo semitransparente */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10" />

      {/* Formulario */}
      <div className="relative z-20 flex flex-col items-center justify-center px-4 w-full">
        
        {/* Logo agrandado */}
        <div className="mb-6">
          <img src={udlaLogo} alt="Logo UDLA" className="h-40 md:h-40 lg:h-32" />
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-center text-2xl font-bold text-udla-red mb-6">
            Iniciar sesión en KinetiCare
          </h2>

          {loginError && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Correo solo institucional */}
            <div>
              <label className="block text-udla-black font-semibold mb-1">Correo electrónico</label>
              <input
                type="email"
                placeholder="usuario@udla.edu.ec"
                {...register("correo", {
                  required: "El correo es obligatorio.",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@udla\.edu\.ec$/i,
                    message: "Solo se permite correo institucional @udla.edu.ec.",
                  },
                })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-udla-red"
              />
              {errors.correo && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.correo.message?.toString()}
                </p>
              )}
            </div>

            {/* Contraseña con ojito */}
            <div className="relative">
              <label className="block text-udla-black font-semibold mb-1">Contraseña</label>
              <input
                type={verPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("contrasena", { required: "La contraseña es obligatoria." })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-udla-red"
              />
              <button
                type="button"
                onClick={() => setVerPassword(!verPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {verPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.contrasena && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.contrasena.message?.toString()}
                </p>
              )}
            </div>

            {/* Botón ingresar */}
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
    </div>
  );
}

export default LoginPage;
