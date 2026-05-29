"use server";
import { db } from "@/src/lib/db";

export async function obtenerGruposDisponibles(idUsuario: number) {
  try {
    // Obtener todos los grupos donde el usuario NO tiene un rol asignado
    const result = await db.execute({
      sql: `
        SELECT g.* 
        FROM grupos g
        WHERE g.id NOT IN (
          SELECT ru.id_grupo 
          FROM rol_usuario ru 
          WHERE ru.id_usuario = ?
        )
      `,
      args: [idUsuario],
    });

    return result.rows;
  } catch (error) {
    console.log(error);
    return [];
  }
}
