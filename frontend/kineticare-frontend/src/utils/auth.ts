import { jwtDecode } from "jwt-decode";

// Define los tipos esperados desde el token JWT
interface DecodedToken {
  [key: string]: any;
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function getRol(): string | null {
  return localStorage.getItem("rol");
}

export function getUsuarioId(): string | null {
  return localStorage.getItem("usuarioId");
}

export function getNombreUsuario(): string | null {
  return localStorage.getItem("nombre");
}

// ✅ Si necesitas decodificar el token para extraer valores específicos
export function decodeToken(): DecodedToken | null {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
}
