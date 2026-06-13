"use server";
import { db } from "@/src/lib/db";

export async function obtenerGrupoPorAsignatura(
  idAsignatura: number,
): Promise<number | null> {
  try {
    const result = await db.execute({
      sql: `SELECT id_grupo FROM asignaturas WHERE id = ?`,
      args: [idAsignatura],
    });
    return Number(result.rows[0]?.id_grupo) || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}