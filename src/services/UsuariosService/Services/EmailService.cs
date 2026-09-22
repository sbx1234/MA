using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace UsuariosService.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task EnviarCodigoVerificacion(string destinatario, string codigo)
        {
            var email = new MimeMessage();

            email.From.Add(new MailboxAddress(
                _config["Email:NombreRemitente"] ?? "Depreciacion Ecuador",
                _config["Email:Correo"] ?? ""
            ));

            email.To.Add(MailboxAddress.Parse(destinatario));
            email.Subject = "Codigo de verificacion - Depreciacion Ecuador";

            email.Body = new TextPart("html")
            {
                Text = $@"
                    <div style='font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0a0f1c; color: #fff; padding: 40px; border-radius: 12px;'>
                        <h2 style='color: #3b82f6;'>Bienvenido a Depreciacion Ecuador</h2>
                        <p>Tu codigo de verificacion es:</p>
                        <h1 style='color: #60a5fa; letter-spacing: 8px; font-size: 36px; text-align: center; background: #0f172a; padding: 20px; border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.3);'>{codigo}</h1>
                        <p>Este codigo expira en <strong>15 minutos</strong>.</p>
                        <p style='color: #94a3b8; font-size: 12px;'>Si no solicitaste esta cuenta, ignora este correo.</p>
                    </div>
                "
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);

            var correo = _config["Email:Correo"] ?? "";
            var password = _config["Email:Password"] ?? "";

            await smtp.AuthenticateAsync(correo, password);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}