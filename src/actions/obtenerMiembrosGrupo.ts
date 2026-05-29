"use server";
import { db } from "@/src/lib/db";

export async function obtenerMiembrosGrupo(idGrupo: number) {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          u.id,
          u.nombre,
          u.email,
          ru.id_rol
        FROM usuarios u
        INNER JOIN rol_usuario ru ON u.id = ru.id_usuario
        WHERE ru.id_grupo = ?
        ORDER BY ru.id_rol DESC, u.nombre ASC
      `,
      args: [idGrupo],
    });
const rows = result.rows ?? [];

    return rows.map((row: any) => ({
      id: Number(row.id),
      nombre: String(row.nombre ?? ""),
      email: String(row.email ?? ""),
      id_rol: Number(row.id_rol),
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}