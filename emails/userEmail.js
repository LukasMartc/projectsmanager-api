import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const confirmAccount = async data => {
  const { name, email, token } = data;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }  
  });

  const info = await transporter.sendMail({
    from:'"Projects Manager" <cuentas@projectsmanajer.com>',
    to: email,
    subject: "Projects Manager - Confirma tu cuenta",
    text:"Confirma tu cuenta en Itech",
    html: `<p>Hola: ${name} Confirma tu cuenta en Projects Manager.</p>
    <p>Tu cuenta ya esta casi lista, solo debes confirmarla en el siguiente enlace:
    <a href="${process.env.FRONTEND_URL}/confirmed/${token}">Confirmar Cuenta</a></p>
    <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje.</p>`
  })
};

export const recoverPassword = async data => {
  const { name, email, token } = data;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }  
  });

  const info = await transporter.sendMail({
    from:'"Projects Manager" <cuentas@projectsmanajer.com>',
    to: email,
    subject: "Projects Manager - Restablece tu contraseña",
    text:"Restablece tu contraseña en Projects Manager",
    html: `<p>Hola: ${name} has solicitado restablecer tu contraseña.</p>
    <p>Sigue el siguiente enlace para generar una nueva contraseña:
    <a href="${process.env.FRONTEND_URL}/forget-password/${token}">Restablecer Contraseña</a></p>
    <p>Si tu no solicitaste restablecer tu contraseña, puedes ignorar este mensaje.</p>`
})
};