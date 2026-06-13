"use server";
import { db } from "@/src/lib/db";

export async function salirGrupo(
    id_grupo: string,
    id_usuario: number
) {
  try {
    await db.execute({
      sql: `DELETE FROM rol_usuario WHERE id_grupo = ? AND id_usuario = ? `,
      args: [id_grupo, id_usuario],
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Error al salir del grupo" };
  }
}