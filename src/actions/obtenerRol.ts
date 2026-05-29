"use server";
import { db } from "@/src/lib/db";

export async function obtenerRol(
  idGrupo: number,
  idUsuario: number,
) {
  try {
    const result = await db.execute({
      sql: `SELECT id_rol FROM rol_usuario WHERE id_usuario = ? AND id_grupo = ?`,
      args: [idUsuario, idGrupo],
    });
    return result.rows[0]?.id_rol ?? null;
  } catch (error) {
    console.log(error);
    return null;
  }
}