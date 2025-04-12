namespace MSGestionDeUsuariosySeguridad.DTOs
{
    public class UsuarioDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Correo { get; set; }
        public int RolId { get; set; }
        public string RolName { get; set; }
    }
}
