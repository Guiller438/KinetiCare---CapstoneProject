using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;

namespace MSNotificaciones.Hubs
{
    public class NotificacionesHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var userId = Context.GetHttpContext()?.Request.Query["userId"];
            var tipo = Context.GetHttpContext()?.Request.Query["tipo"];

            if (!string.IsNullOrEmpty(userId) && !string.IsNullOrEmpty(tipo))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"{tipo}:{userId}");
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
        }
    }
}
