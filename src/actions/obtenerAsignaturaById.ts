"use server";
import { db } from "@/src/lib/db";

interface Asignatura {
  id: number;
  id_grupo: number;
  nombre: string;
  color: string | null;
  descripcion: string | null;
}

export async function obtenerAsignaturaById(
  idAsignatura: number
): Promise<Asignatura | null> {
  try {
    const result = await db.execute({
      sql: `SELECT * FROM asignaturas WHERE id = ?`,
      args: [idAsignatura],
    });

    const row = result.rows[0];

    if (!row) {
      return null;
    }

    return {
      id: Number(row.id),
      id_grupo: Number(row.id_grupo),
      nombre: String(row.nombre),
      color: row.color as string | null,
      descripcion: row.descripcion as string | null,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}