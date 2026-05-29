"use server";

import { db } from "@/src/lib/db";
import bcrypt from "bcryptjs";

async function cuentaExistente(correo: string)
{
    const result = await db.execute({
    sql: `
        SELECT *
        FROM usuarios
        WHERE email = ?
    `,
    args: [correo],
    });
    if(result.rows[0] != null)
    {
        return true
    }
}

export async function registerUser(
  nombre: string,
  email: string,
  password: string
) {
    
    if(await cuentaExistente(email))
    {
        return {
            success: false,
            message: "Esta cuenta con ese correo ya existe",
        };
    }
    
    const hashedPassword =
    await bcrypt.hash(password, 10);
  await db.execute({
    sql: `
      INSERT INTO usuarios (nombre, email, password)
      VALUES (?, ?, ?)
    `,
    args: [nombre, email, hashedPassword],
  });

  return {
    success: true,
    message: "",
  };
}