"use server";

import { db } from "@/src/lib/db";

export async function createRolInGroup(
  idAlumno: number,
  idCurso: number,
  rol: string
) {
  try {

    const responseId = await db.execute({
        sql: `
        SELECT id from roles WHERE nombre = ?
      `,
      args: [rol],
    })
        const rolId =
    responseId.rows[0]?.id
    if (!rolId) {
        return {
            success: false,
            message: "Rol no encontrado",
        };
    }
    await db.execute({
    sql: `
        INSERT INTO rol_usuario (id_usuario, id_grupo, id_rol)
        VALUES (?, ?, ?)
    `,
    args: [idAlumno, idCurso, rolId],
    });

    return {
      success: true,
      message: "Grupo creado correctamente",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Error al crear el grupo",
    };
  }
}