import axios from "axios";

const api = axios.create({
  baseURL: "http://172.31.56.93:7000", // ⚠️ URL del API Gateway
  headers: {
    "Content-Type": "application/json",
  },
});

export const obtenerNotificaciones = async (userId: string, tipo: string) => {
  const response = await fetch(
    `http://localhost:5010/api/Notification/Notificaciones?receptorId=${userId}&tipoReceptor=${tipo}`
  );

  console.log(
    `Obteniendo notificaciones para ${tipo} con ID ${userId}...`);

  if (!response.ok) {
    throw new Error(`Error al obtener notificaciones: ${response.statusText}`);
  }

  return await response.json();
};



export const marcarNotificacionComoLeida = async (id: number) => {
  const response = await fetch(`http://localhost:5010/api/Notification/marcar-leida/${id}`, {
    method: "PATCH",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ Error al marcar como leída: ${errorText}`);
  }
};

export const marcarTodasNotificacionesComoLeidas = async (
  receptorId: string,
  tipoReceptor: string
) => {
  const response = await fetch(
    `http://localhost:5010/api/Notification/MarcarTodasLeidas?receptorId=${receptorId}&tipoReceptor=${tipoReceptor}`,
    { method: "PATCH" }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ Error al marcar todas como leídas: ${errorText}`);
  }
};


export default api;


