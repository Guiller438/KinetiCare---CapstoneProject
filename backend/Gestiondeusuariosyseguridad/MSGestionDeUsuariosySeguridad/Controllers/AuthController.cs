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
        [Authorize] 
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

    }
}
