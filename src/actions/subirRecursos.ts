"use server";
import { db } from "@/src/lib/db";

export async function subirRecurso(
  idAsignatura: number,
  idUsuario: number,
  nombre: string,
  tipo: string,
  url: string,
  descripcion?: string
) {
  try {

    const result = await db.execute({
      sql: `
        INSERT INTO recursos
        (asignatura_id, id_alumno, nombre, tipo, url)
        VALUES (?, ?, ?, ?, ?)
      `,
      args: [idAsignatura, idUsuario, nombre, tipo, url],
    });

    return { success: true, id: result.lastInsertRowid };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Error al subir el recurso" };
  }
}