"use server";
import { db } from "@/src/lib/db";

export async function obtenerDatosPersona(
  idUser: number,
): Promise<string | null> {
  try {
    const result = await db.execute({
      sql: `SELECT nombre FROM usuarios WHERE id = ?`,
      args: [idUser],
    });
    return result.rows[0]?.nombre?.toString() ?? null;
  } catch (error) {
    console.log(error);
    return null;
  }
}