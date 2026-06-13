import { transporter } from "./mail";

export async function sendVerificationEmail(
  email: string,
  token: string
) {
  const verificationUrl =
    `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verifica tu cuenta",
    html: `
      <h2>Bienvenido</h2>
      <p>Pulsa el siguiente enlace para verificar tu cuenta:</p>
      <a href="${verificationUrl}">
        Verificar cuenta
      </a>
    `,
  });
}