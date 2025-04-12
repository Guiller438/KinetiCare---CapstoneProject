using BCrypt.Net;

namespace MSGestionDeUsuariosySeguridad.Helpers
{
    public class PasswordHasher
    {
        // Hashear una contraseña para guardarla en la base de datos
        public static string Hashear(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        // Verificar si una contraseña en texto plano coincide con el hash guardado
        public static bool Verificar(string password, string hash)
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
    }
}
