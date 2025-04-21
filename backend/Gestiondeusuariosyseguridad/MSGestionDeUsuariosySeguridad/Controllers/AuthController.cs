using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MSGestionDeUsuariosySeguridad.DTOs;
using MSGestionDeUsuariosySeguridad.Interfaces;

namespace MSGestionDeUsuariosySeguridad.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
        /// Endpoint para iniciar sesión y obtener un token JWT.
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO dto)
        {
            var resultado = await _authService.Login(dto, HttpContext);

            if (resultado == null)
                return Unauthorized(new { mensaje = "Credenciales inválidas." });

            return Ok(resultado);
        }

        [HttpPost("logout")]
        //[Authorize] 
        public async Task<IActionResult> Logout()
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString();

            // Eliminar el prefijo "Bearer " si existe
            if (token.StartsWith("Bearer "))
            {
                token = token.Substring("Bearer ".Length).Trim();
            }

            var resultado = await _authService.Logout(token);

            if (!resultado)
                return BadRequest(new { mensaje = "Token inválido o ya revocado." });

            return Ok(new { mensaje = "Sesión cerrada correctamente." });
        }


        /// Endpoint para registrar un nuevo usuario.
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO dto)
        {
            var resultado = await _authService.Register(dto);

            if (resultado == "Usuario registrado correctamente.")
                return Ok(new { mensaje = resultado });

            return BadRequest(new { error = resultado });
        }

        /// Endpoint para restablecer contraseña
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromQuery] string token, [FromBody] string nuevaContrasena)
        {
            var resultado = await _authService.ResetPassword(token, nuevaContrasena);

            if (!resultado)
                return BadRequest(new { mensaje = "Token inválido o expirado." });

            return Ok(new { mensaje = "Contraseña restablecida correctamente." });
        }

        /// Obtener todos los usuarios (solo administradores)
        [HttpGet("usuarios")]
        //[Authorize(Roles = "Administrador")]
        public async Task<IActionResult> GetAllUsers()
        {
            var usuarios = await _authService.GetAllUsers();
            return Ok(usuarios);
        }

        /// Obtener un usuario por email (solo administradores)
        [HttpGet("usuario")]
        //[Authorize(Roles = "Administrador")]
        public async Task<IActionResult> GetUserByEmail([FromQuery] string email)
        {
            var usuario = await _authService.GetUserByEmail(email);
            if (usuario == null)
                return NotFound(new { mensaje = "Usuario no encontrado." });

            return Ok(usuario);
        }

        /// Modificar el rol de un usuario (solo administradores)
        [HttpPut("edit")]
        //[Authorize(Roles = "Administrador")]
        public async Task<IActionResult> UpdateUserRole(EditUserDTO newUser)
        {
            var resultado = await _authService.UpdateUser(newUser);
            if (!resultado)
                return BadRequest(new { mensaje = "Usuario o rol no válido." });

            return Ok(new { mensaje = "Rol actualizado correctamente." });
        }

        /// Eliminar un usuario (solo administradores)
        [HttpDelete("{userId}")]
        //[Authorize(Roles = "Administrador")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            var resultado = await _authService.DeleteUser(userId);
            if (!resultado)
                return NotFound(new { mensaje = "Usuario no encontrado o ya eliminado." });

            return Ok(new { mensaje = "Usuario eliminado correctamente." });
        }

    }
}
