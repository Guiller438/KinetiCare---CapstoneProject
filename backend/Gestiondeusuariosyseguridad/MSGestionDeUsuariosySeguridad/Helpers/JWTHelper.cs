using Microsoft.IdentityModel.Tokens;
using MSGestionDeUsuariosySeguridad.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace MSGestionDeUsuariosySeguridad.Helpers
{
    public class JWTHelper
    {
        public static string GenerarToken(Usuario usuario, IConfiguration config, out DateTime expiracion)
        {
            // Obtener clave secreta desde appsettings.json
            var claveSecreta = config["Jwt:ClaveSecreta"];
            var emisor = config["Jwt:Emisor"];
            var audiencia = config["Jwt:Audiencia"];
            var minutos = int.Parse(config["Jwt:DuracionMinutos"]);

            // Generar clave de seguridad
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(claveSecreta));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Crear los claims (información dentro del token)
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Email, usuario.Correo),
                new Claim(ClaimTypes.Role, usuario.Rol?.Nombre ?? "SinRol"),
                new Claim("nombre", usuario.Nombre)
            };

            // Establecer la expiración
            expiracion = DateTime.UtcNow.AddMinutes(minutos);

            // Crear el token
            var token = new JwtSecurityToken(
                issuer: emisor,
                audience: audiencia,
                claims: claims,
                expires: expiracion,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
