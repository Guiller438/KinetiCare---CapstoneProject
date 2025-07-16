import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def enviar_correo_tratamiento(destinatario: str, asunto: str, cuerpo: str):
    remitente = os.getenv("EMAIL_USER")
    contraseña = os.getenv("EMAIL_PASS")

    msg = MIMEMultipart()
    msg['From'] = remitente
    msg['To'] = destinatario
    msg['Subject'] = asunto

    msg.attach(MIMEText(cuerpo, 'plain'))

    with smtplib.SMTP('smtp.gmail.com', 587) as servidor:
        servidor.starttls()
        servidor.login(remitente, contraseña)
        servidor.send_message(msg)
