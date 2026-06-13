import nodemailer from "nodemailer";
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS?.length);
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(
  email: string,
  token: string
) {
  const url =
    `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🎓 Verifica tu cuenta en Aulas",
    html: `
      <div style="
        background:#f4f7fb;
        padding:40px 20px;
        font-family:Arial,sans-serif;
      ">
        <div style="
          max-width:600px;
          margin:0 auto;
          background:white;
          border-radius:16px;
          overflow:hidden;
          box-shadow:0 8px 25px rgba(0,0,0,0.08);
        ">

          <div style="
            background:linear-gradient(135deg,#2563eb,#1d4ed8);
            padding:30px;
            text-align:center;
          ">
            <h1 style="
              color:white;
              margin:0;
              font-size:32px;
            ">
              🎓 Aulas
            </h1>

            <p style="
              color:#dbeafe;
              margin-top:10px;
              font-size:16px;
            ">
              Verificación de cuenta
            </p>
          </div>

          <div style="padding:40px;">
            <h2 style="
              color:#111827;
              margin-bottom:20px;
            ">
              ¡Bienvenido!
            </h2>

            <p style="
              color:#4b5563;
              font-size:16px;
              line-height:1.7;
            ">
              Gracias por registrarte en <strong>Aulas</strong>.
              Para activar tu cuenta y empezar a utilizar la plataforma,
              pulsa el botón de abajo.
            </p>

            <div style="
              text-align:center;
              margin:35px 0;
            ">
              <a
                href="${url}"
                style="
                  background:#2563eb;
                  color:white;
                  text-decoration:none;
                  padding:16px 32px;
                  border-radius:10px;
                  font-weight:bold;
                  display:inline-block;
                  font-size:16px;
                "
              >
                ✅ Verificar cuenta
              </a>
            </div>

            <p style="
              color:#6b7280;
              font-size:14px;
            ">
              Si el botón no funciona, copia y pega este enlace en tu navegador:
            </p>

            <div style="
              background:#f3f4f6;
              padding:12px;
              border-radius:8px;
              word-break:break-all;
              font-size:13px;
              color:#374151;
            ">
              ${url}
            </div>

            <p style="
              margin-top:30px;
              color:#6b7280;
              font-size:14px;
              line-height:1.6;
            ">
              Si no has creado esta cuenta, puedes ignorar este mensaje.
            </p>
          </div>

          <div style="
            background:#f9fafb;
            padding:20px;
            text-align:center;
            border-top:1px solid #e5e7eb;
          ">
            <p style="
              margin:0;
              color:#9ca3af;
              font-size:12px;
            ">
              © ${new Date().getFullYear()} Aulas · Todos los derechos reservados
            </p>
          </div>

        </div>
      </div>
    `,
  });
}export async function sendResetPasswordEmail(
  email: string,
  token: string
) {
  const url =
    `${process.env.NEXT_PUBLIC_APP_URL}/reset_password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🔑 Restablecer contraseña en Aulas",
    html: `
      <div style="
        background:#f4f7fb;
        padding:40px 20px;
        font-family:Arial,sans-serif;
      ">
        <div style="
          max-width:600px;
          margin:0 auto;
          background:white;
          border-radius:16px;
          overflow:hidden;
          box-shadow:0 8px 25px rgba(0,0,0,0.08);
        ">

          <div style="
            background:linear-gradient(135deg,#2563eb,#1d4ed8);
            padding:30px;
            text-align:center;
          ">
            <h1 style="
              color:white;
              margin:0;
              font-size:32px;
            ">
              🎓 Aulas
            </h1>

            <p style="
              color:#dbeafe;
              margin-top:10px;
              font-size:16px;
            ">
              Recuperación de contraseña
            </p>
          </div>

          <div style="padding:40px;">
            <h2 style="
              color:#111827;
              margin-bottom:20px;
            ">
              ¿Has olvidado tu contraseña?
            </h2>

            <p style="
              color:#4b5563;
              font-size:16px;
              line-height:1.7;
            ">
              Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en
              <strong> Aulas</strong>.
              Si has sido tú, pulsa el botón de abajo para crear una nueva contraseña.
            </p>

            <div style="
              text-align:center;
              margin:35px 0;
            ">
              <a
                href="${url}"
                style="
                  background:#2563eb;
                  color:white;
                  text-decoration:none;
                  padding:16px 32px;
                  border-radius:10px;
                  font-weight:bold;
                  display:inline-block;
                  font-size:16px;
                "
              >
                🔑 Restablecer contraseña
              </a>
            </div>

            <p style="
              color:#6b7280;
              font-size:14px;
            ">
              Si el botón no funciona, copia y pega este enlace en tu navegador:
            </p>

            <div style="
              background:#f3f4f6;
              padding:12px;
              border-radius:8px;
              word-break:break-all;
              font-size:13px;
              color:#374151;
            ">
              ${url}
            </div>

            <p style="
              margin-top:30px;
              color:#6b7280;
              font-size:14px;
              line-height:1.6;
            ">
              Si no has solicitado este cambio de contraseña, puedes ignorar este mensaje.
              Tu contraseña actual seguirá siendo válida y nadie podrá modificarla sin acceder a este enlace.
            </p>
          </div>

          <div style="
            background:#f9fafb;
            padding:20px;
            text-align:center;
            border-top:1px solid #e5e7eb;
          ">
            <p style="
              margin:0;
              color:#9ca3af;
              font-size:12px;
            ">
              © ${new Date().getFullYear()} Aulas · Todos los derechos reservados
            </p>
          </div>

        </div>
      </div>
    `,
  });
}