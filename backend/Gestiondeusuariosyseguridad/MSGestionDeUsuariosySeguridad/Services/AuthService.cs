using Microsoft.EntityFrameworkCore;
using MSGestionDeUsuariosySeguridad.Data;
using MSGestionDeUsuariosySeguridad.DTOs;
using MSGestionDeUsuariosySeguridad.Helpers;
using MSGestionDeUsuariosySeguridad.Interfaces;
using MSGestionDeUsuariosySeguridad.Models;

namespace MSGestionDeUsuariosySeguridad.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<LoginResponseDto> Login(LoginRequestDTO dto, HttpContext httpContext)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Rol)
                .FirstOrDefaultAsync(u => u.Correo == dto.Correo && u.Activo == true);

            // Usuario no existe
            if (usuario == null)
            {
                var historialFallido = new HistorialLogin
                {
                    UsuarioId = 0, // o null si permites valores nulos
                    Ip = IPHelpers.ObtenerIp(httpContext),
                    FechaHora = DateTime.UtcNow,
                    Exitoso = false
                };

                _context.HistorialLogins.Add(historialFallido);
                await _context.SaveChangesAsync();
                return null;
            }

            // Contraseña inválida
            var esValida = PasswordHasher.Verificar(dto.Contrasena, usuario.ContrasenaHasheada);
            if (!esValida)
            {
                var historialFallido = new HistorialLogin
                {
                    UsuarioId = usuario.Id,
                    Ip = IPHelpers.ObtenerIp(httpContext),
                    FechaHora = DateTime.UtcNow,
                    Exitoso = false
                };

                _context.HistorialLogins.Add(historialFallido);
                await _context.SaveChangesAsync();
                return null;
            }

            // Generar token
            var token = JWTHelper.GenerarToken(usuario, _config, out var expiracion);

            // Guardar token en la base de datos
            var nuevoToken = new TokenAcceso
            {
                UsuarioId = usuario.Id,
                Token = token,
                FechaExpiracion = expiracion,
                Revocado = false
            };
            _context.TokenAccesos.Add(nuevoToken);

            // Registrar intento exitoso
            var historialExitoso = new HistorialLogin
            {
                UsuarioId = usuario.Id,
                Ip = IPHelpers.ObtenerIp(httpContext),
                FechaHora = DateTime.UtcNow,
                Exitoso = true
            };
            _context.HistorialLogins.Add(historialExitoso);

            await _context.SaveChangesAsync();

            return new LoginResponseDto
            {
                Token = token,
                Expiracion = expiracion,
                Nombre = usuario.Nombre,
                Rol = usuario.Rol?.Nombre ?? "Desconocido"
            };
        }

        public async Task<string> Register(RegisterRequestDTO dto)
        {
            var existe = await _context.Usuarios.AnyAsync(u => u.Correo == dto.Correo);
            if (existe)
                return "El correo ya está registrado.";

            var rol = await _context.Rols.FindAsync(dto.RolId);
            if (rol == null)
                return "El rol especificado no existe.";

            var nuevoUsuario = new Usuario
            {
                Nombre = dto.Nombre,
                Correo = dto.Correo,
                ContrasenaHasheada = PasswordHasher.Hashear(dto.Contrasena),
                RolId = dto.RolId,
                Activo = true,
                FechaCreacion = DateTime.UtcNow
            };

            _context.Usuarios.Add(nuevoUsuario);
            await _context.SaveChangesAsync();

            return "Usuario registrado correctamente.";
        }

        public async Task<bool> Logout(string token)
        {
            var tokenGuardado = await _context.TokenAccesos
                .FirstOrDefaultAsync(t => t.Token == token && t.Revocado == false);

            if (tokenGuardado == null)
                return false;

            tokenGuardado.Revocado = true;
            await _context.SaveChangesAsync();

            return true;
        }


    }
}
