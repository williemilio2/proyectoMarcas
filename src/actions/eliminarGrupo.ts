"use server";

import { db } from "@/src/lib/db";

export async function eliminarGrupo(idGrupo: string) {
  try {

    await db.execute({
      sql: `
        DELETE FROM archivos
        WHERE asignatura_id IN (
          SELECT id
          FROM asignaturas
          WHERE id_grupo = ?
        )
      `,
      args: [idGrupo],
    });

    await db.execute({
      sql: `
        DELETE FROM asignaturas
        WHERE id_grupo = ?
      `,
      args: [idGrupo],
    });

    await db.execute({
      sql: `
        DELETE FROM grupos
        WHERE id = ?
      `,
      args: [idGrupo],
    });

    return { success: true };

  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "Error al eliminar grupo",
    };
  }
}