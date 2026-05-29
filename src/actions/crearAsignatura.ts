"use server";
import { db } from "@/src/lib/db";

export async function crearAsignatura(
  idGrupo: number,
  nombre: string,
  descripcion: string | null,
  color: string
) {
  try {
    const result = await db.execute({
      sql: `INSERT INTO asignaturas (id_grupo, nombre, descripcion, color) VALUES (?, ?, ?, ?)`,
      args: [idGrupo, nombre, descripcion, color],
    });

    return {
    success: true,
    id: Number(result.lastInsertRowid),
    };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Error al crear la asignatura" };
  }
}