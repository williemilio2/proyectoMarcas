"use server";
import { db } from "@/src/lib/db";

export async function eliminarRecurso(idRecurso: number) {
  try {
    await db.execute({
      sql: `DELETE FROM recursos WHERE id = ?`,
      args: [idRecurso],
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Error al eliminar el recurso" };
  }
}