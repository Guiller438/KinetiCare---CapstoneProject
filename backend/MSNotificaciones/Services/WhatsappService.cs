using Microsoft.Extensions.Configuration;
using MSNotificaciones.Interfaces;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace MSNotificaciones.Services
{
    public class WhatsappService : IWhatsappService
    {
        private readonly string _accountSid;
        private readonly string _authToken;
        private readonly string _fromNumber;

        public WhatsappService(IConfiguration configuration)
        {
            _accountSid = configuration["Twilio:AccountSid"];
            _authToken = configuration["Twilio:AuthToken"];
            _fromNumber = configuration["Twilio:FromNumber"];

            TwilioClient.Init(_accountSid, _authToken);
        }

        public async Task<bool> EnviarMensaje(string numeroDestino, string mensaje)
        {
            try
            {
                var message = await MessageResource.CreateAsync(
                    body: mensaje,
                    from: new PhoneNumber(_fromNumber),
                    to: new PhoneNumber("whatsapp:" + numeroDestino)
                );

                Console.WriteLine($"✅ Mensaje enviado con SID: {message.Sid}");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error al enviar WhatsApp: {ex.Message}");
                return false;
            }
        }
    }
}
