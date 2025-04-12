using System.Net;

namespace MSGestionDeUsuariosySeguridad.Helpers
{
    public class IPHelpers
    {
        public static string ObtenerIp(HttpContext context)
        {
            var ip = context.Connection.RemoteIpAddress;

            // Si es IPv6 localhost (::1), conviértelo a IPv4
            if (ip != null && ip.Equals(IPAddress.IPv6Loopback))
                return "127.0.0.1";

            return ip?.ToString() ?? "Desconocida";
        }
    }
}
