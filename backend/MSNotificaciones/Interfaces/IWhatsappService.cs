namespace MSNotificaciones.Interfaces
{
    public interface IWhatsappService
    {
        Task<bool> EnviarMensaje(string numeroDestino, string mensaje);
    }
}
