import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaTiktok,
    FaYoutube,
  } from "react-icons/fa";
  import udlaLogo from "../assets/udla-logo-blanco.png"; // usa el logo horizontal
  
  function Footer() {
    return (
      <footer className="bg-black text-white px-6 py-4 text-center relative">
        <div className="flex justify-center items-center mb-2">
          <p className="text-sm font-semibold">
            "El mundo necesita gente que ame lo que hace."
          </p>
        </div>
  
        <div className="flex justify-center items-center space-x-4 mb-2 text-udla-red text-lg">
          <FaInstagram />
          <FaFacebookF />
          <FaLinkedinIn />
          <FaTiktok />
          <FaYoutube />
        </div>
  
        <p className="text-xs text-gray-400 mb-2">
          Universidad de Las Américas © 2025
        </p>
  
        <div className="absolute top-1/2 right-6 transform -translate-y-1/2">
          <img src={udlaLogo} alt="UDLA" className="h-20 w-auto object-contain" />
        </div>
      </footer>
    );
  }
  
  export default Footer;
  