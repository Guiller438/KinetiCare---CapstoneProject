import { FaUser } from "react-icons/fa";
import udlaLogo from "../assets/udla-logo-doslineas.png";

function Header() {
  return (
    <header className="w-full bg-white shadow px-6 py-3 grid grid-cols-3 items-center">
      {/* Izquierda: Logo */}
      <div className="flex items-center">
        <img
          src={udlaLogo}
          alt="Logo UDLA"
          className="h-16 w-auto object-contain"
        />
      </div>

      {/* Centro: Frase inspiradora */}
      <div className="flex justify-center">
        <p className="text-udla-black font-semibold text-md italic text-center">
          El mundo necesita gente que ame lo que hace.
        </p>
      </div>

      {/* Derecha: Icono de usuario */}
      <div className="flex justify-end">
        <button
          className="text-udla-red text-2xl hover:text-red-700 transition"
          aria-label="Perfil"
        >
          <FaUser />
        </button>
      </div>
    </header>
  );
}

export default Header;
