using MSGestionDeUsuariosySeguridad.DTOs;

namespace MSGestionDeUsuariosySeguridad.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto> Login(LoginRequestDTO dto, HttpContext httpContext);
        Task<string> Register(RegisterRequestDTO dto);

        Task<bool> Logout(string token);

    }
}
