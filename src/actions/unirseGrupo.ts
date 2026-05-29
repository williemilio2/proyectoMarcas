"use server";
import { db } from "@/src/lib/db";

export async function unirseGrupo(idUsuario: number, idGrupo: number) {
  try {
    // Obtener el id del rol "alumno" (o el rol por defecto para usuarios que se unen)
    const responseId = await db.execute({
      sql: `SELECT id FROM roles WHERE nombre = ?`,
      args: ["Alumno"],
    });

    const rolId = responseId.rows[0]?.id;
    if (!rolId) {
      return {
        success: false,
        message: "Rol no encontrado",
      };
    }
    // Verificar que el usuario no esté ya en el grupo
    const existente = await db.execute({
      sql: `SELECT * FROM rol_usuario WHERE id_usuario = ? AND id_grupo = ?`,
      args: [idUsuario, idGrupo],
    });

    if (existente.rows.length > 0) {
      return {
        success: false,
        message: "Ya eres miembro de este grupo",
      };
    }

    // Insertar el usuario en el grupo
    await db.execute({
      sql: `INSERT INTO rol_usuario (id_usuario, id_grupo, id_rol) VALUES (?, ?, ?)`,
      args: [idUsuario, idGrupo, rolId],
    });

    return {
      success: true,
      message: "Te has unido al grupo correctamente",
    };
  } catch (error) {
    console.log(error);
    console.log(idUsuario);
    console.log(idGrupo);
    return {
      success: false,
      message: "Error al unirse al grupo" + error,
    };
  }
}
