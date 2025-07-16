import { HubConnectionBuilder, HubConnection, LogLevel } from "@microsoft/signalr";

let connection: HubConnection;

export const iniciarConexionSignalR = async (
  userId: string,
  tipo: "Usuario" | "Paciente",
  onNotificacionRecibida?: (titulo: string, mensaje: string) => void
): Promise<void> => {
  connection = new HubConnectionBuilder()
    .withUrl(`http://172.31.56.69:5010/hub/notificaciones?userId=${userId}&tipo=${tipo}`)
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  connection.on("RecibirNotificacion", (titulo: string, mensaje: string) => {
    console.log("🔔 Notificación recibida:", titulo, mensaje);
    mostrarNotificacion(titulo, mensaje);
    if (onNotificacionRecibida) {
      onNotificacionRecibida(titulo, mensaje);
    }
  });

  try {
    await connection.start();
    console.log("✅ Conectado a SignalR");
  } catch (err) {
    console.error("❌ Error al conectar a SignalR:", err);
  }
};

const mostrarNotificacion = (titulo: string, mensaje: string): void => {
  if (Notification.permission === "granted") {
    new Notification(titulo, {
      body: mensaje,
      icon: "/notificacion.png" // Puedes reemplazarlo por cualquier ícono personalizado
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(titulo, {
          body: mensaje
        });
      }
    });
  }
};
