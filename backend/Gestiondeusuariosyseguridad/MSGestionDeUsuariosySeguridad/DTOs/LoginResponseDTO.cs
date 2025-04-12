using System;

namespace MSGestionDeUsuariosySeguridad.DTOs
{
    public class LoginResponseDto
    {
        public string Token { get; set; }
        public DateTime Expiracion { get; set; }
        public string Nombre { get; set; }
        public string Rol { get; set; }
    }
}
