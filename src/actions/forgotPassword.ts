"use server";

import crypto from "crypto";
import { db } from "@/src/lib/db";
import { sendResetPasswordEmail } from "@/src/lib/mail";
import { redirect } from "next/navigation";

export async function sendResetLink(
  formData: FormData
) {
  const email = formData.get("email") as string;

  const user = await db.execute({
    sql: `
      SELECT id
      FROM usuarios
      WHERE email = ?
    `,
    args: [email],
  });

  if (!user.rows[0]) {
    return;
  }

  const token =
    crypto.randomBytes(32).toString("hex");

  const expires =
    new Date(Date.now() + 1000 * 60 * 60); // 1 hora

  await db.execute({
    sql: `
      INSERT OR REPLACE INTO usuarios_reset_password
      (id_usuario, reset_token, expires_at)
      VALUES (?, ?, ?)
    `,
    args: [
      user.rows[0].id,
      token,
      expires.toISOString(),
    ],
  });

  await sendResetPasswordEmail(
    email,
    token
  );
  redirect("/forgot_password?sent=true");
}