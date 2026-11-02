import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import nodemailer from 'nodemailer';

const port = Number(process.env.SMTP_PORT || 465);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === 'true'
    : port === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function enviarCodigoRecuperacao(email, codigo) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP não configurado.');
  }

  return transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Código para redefinir sua senha - AlertaMed',
    text: [
      'Você solicitou a redefinição da sua senha no AlertaMed.',
      '',
      `Seu código de verificação é: ${codigo}`,
      '',
      'O código expira em 10 minutos.',
      'Se você não solicitou essa alteração, ignore este e-mail.',
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto">
        <h2>Recuperação de senha</h2>
        <p>Você solicitou a redefinição da senha da sua conta AlertaMed.</p>
        <p>Digite este código no aplicativo:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px">
          ${codigo}
        </p>
        <p>Este código expira em 10 minutos.</p>
        <p>Se você não solicitou essa alteração, ignore este e-mail.</p>
      </div>
    `,
  });
}
