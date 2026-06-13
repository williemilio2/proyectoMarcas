"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/src/lib/db";

export async function updatePassword(
  prevState: { error: string },
  formData: FormData
) {
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;

  if (!password || password.length < 6) {
    return {
      error: "La contraseña debe tener al menos 6 caracteres",
    };
  }

  const result = await db.execute({
    sql: `
      SELECT id_usuario
      FROM usuarios_reset_password
      WHERE reset_token = ?
        AND expires_at > CURRENT_TIMESTAMP
    `,
    args: [token],
  });

  if (!result.rows[0]) {
    return {
      error: "El enlace ha expirado",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.execute({
    sql: `
      UPDATE usuarios
      SET password = ?
      WHERE id = ?
    `,
    args: [hashedPassword, result.rows[0].id_usuario],
  });

  await db.execute({
    sql: `
      DELETE FROM usuarios_reset_password
      WHERE reset_token = ?
    `,
    args: [token],
  });

  redirect("/login?reset=success");
}