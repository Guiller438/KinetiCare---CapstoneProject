namespace MSGestionDeUsuariosySeguridad.DTOs
{
    public class EditUserDTO
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Correo { get; set; }
        public int RolId { get; set; }

        public bool? Activo { get; set; }
    }
}
