"use server";

import { db } from "@/src/lib/db";
const safeRows = <T>(rows: any[]): T[] =>
  JSON.parse(JSON.stringify(rows));
export async function obtenerAsignaturas(idGrupo: number) {
  try {
    const result = await db.execute({
      sql: `SELECT id, id_grupo, nombre, descripcion, color FROM asignaturas WHERE id_grupo = ?`,
      args: [idGrupo],
    });
    // 🔥 ESTO ES LA CLAVE REAL
     const rows = safeRows<any>(result.rows);

    return rows.map((row: any) => ({
      id: Number(row.id),
      id_grupo: Number(row.id_grupo),
      nombre: row.nombre ?? "",
      descripcion: row.descripcion ?? null,
      color: row.color ?? null,
    }));
  } catch (error) {
    console.error("Error obtenerAsignaturas:", error);
    return [];
  }
}