﻿namespace MSGestionDeUsuariosySeguridad.DTOs
{
    public class RegisterRequestDTO
    {
        public string Nombre { get; set; }
        public string Correo { get; set; }
        public string Contrasena { get; set; }
        public int RolId { get; set; }
    }
}
