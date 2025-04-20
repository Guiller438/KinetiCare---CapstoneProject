import udlaLogo from "../assets/udla-logo-negro.png";

function LoginPage() {
  return (
    <div className="min-h-screen bg-udla-light flex flex-col items-center justify-center px-4">
      
      {/* LOGO fuera del cuadro blanco */}
      <div className="mb-4">
        <img src={udlaLogo} alt="Logotipo UDLA" className="h-20" />
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-center text-2xl font-bold text-udla-red mb-6">
          Iniciar sesión en KinetiCare
        </h2>

        <form className="space-y-5">
          <div>
            <label className="block text-udla-black font-semibold mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="usuario@udla.edu.ec"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-udla-red"
            />
          </div>

          <div>
            <label className="block text-udla-black font-semibold mb-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-udla-red"
            />
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
