using MSGestionDeUsuariosySeguridad.DTOs;

namespace MSGestionDeUsuariosySeguridad.Interfaces
{
    public interface IAuthService
    {
        // Método para iniciar sesión
        Task<LoginResponseDto> Login(LoginRequestDTO dto, HttpContext httpContext);

        // Método para registrar un nuevo usuario
        Task<string> Register(RegisterRequestDTO dto);

        // Método para logout
        Task<bool> Logout(string token);

        // Método para restablecer contraseña
        Task<bool> ResetPassword(string token, string nuevaContrasena);

        // Método para obtener una lista de todos los usuarios
        Task<List<UsuarioDTO>> GetAllUsers();

        // Método para obtener un usuario por correo
        Task<UsuarioDTO> GetUserByEmail(string email);

        // Método para editar usuarios
        Task<bool> UpdateUser(EditUserDTO dto);

        // Método para eliminar un usuario
        Task<bool> DeleteUser(int userId);



    }
}
