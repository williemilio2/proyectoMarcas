"use server";

import { db } from "@/src/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/src/lib/mail";

async function cuentaExistente(correo: string) {
  const result = await db.execute({
    sql: `
      SELECT *
      FROM usuarios
      WHERE email = ?
    `,
    args: [correo],
  });

  return result.rows.length > 0;
}

export async function registerUser(
  nombre: string,
  email: string,
  password: string
) {
  if (await cuentaExistente(email)) {
    return {
      success: false,
      message: "Esta cuenta con ese correo ya existe",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString("hex");

  // INSERT usuario
  const usuarioNuevo = await db.execute({
    sql: `
      INSERT INTO usuarios (nombre, email, password)
      VALUES (?, ?, ?)
    `,
    args: [nombre, email, hashedPassword],
  });

  const rawId = usuarioNuevo.lastInsertRowid;

  if (rawId === undefined || rawId === null) {
    throw new Error("No se pudo obtener el ID del usuario creado");
  }

  const userId = Number(rawId);

  // INSERT verificación
  await db.execute({
    sql: `
      INSERT INTO usuarios_verificacion
      (id_usuario, verificado, verification_token)
      VALUES (?, ?, ?)
    `,
    args: [userId, 0, verificationToken],
  });

  await sendVerificationEmail(email, verificationToken);

  return {
    success: true,
    message: "",
  };
}