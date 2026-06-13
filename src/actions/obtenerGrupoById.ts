"use server";
import { db } from "@/src/lib/db";

export async function obtenerGrupoById(idGrupo: number) {
  try {
    const result = await db.execute({
      sql: `SELECT * FROM grupos WHERE id = ?`,
      args: [idGrupo],
    });
    return JSON.parse(JSON.stringify(result.rows));
  } catch (error) {
    console.log(error);
    return null;
  }
}