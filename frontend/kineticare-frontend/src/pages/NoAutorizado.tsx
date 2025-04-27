import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function NoAutorizado() {
  return (
    <div className="min-h-screen flex flex-col bg-udla-light text-center">
      <Header />

      <main className="flex-grow flex flex-col justify-center items-center px-4">
        <h1 className="text-4xl font-bold text-udla-red mb-4">Acceso Denegado 🚫</h1>
        <p className="text-gray-700 mb-6 max-w-lg">
          No tienes los permisos necesarios para acceder a esta página. Por favor, verifica tu cuenta o contacta al administrador.
        </p>

        <Link
          to="/"
          className="bg-udla-red text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
        >
          Volver al inicio
        </Link>
      </main>

      <Footer />
    </div>
  );
}

export default NoAutorizado;
