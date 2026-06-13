"use server";
import { db } from "@/src/lib/db";

interface Recurso {
  id: number;
  id_asignatura: number;
  id_usuario: number;
  nombre: string;
  tipo: string;
  url: string;
  descripcion: string | null;
  fecha_subida: string;
}

export async function obtenerRecursos(
  idAsignatura: number
): Promise<Recurso[]> {
  try {
    const result = await db.execute({
      sql: `SELECT * FROM recursos WHERE id_asignatura = ? ORDER BY fecha_subida DESC`,
      args: [idAsignatura],
    });

    return result.rows.map((row: any) => ({
      id: Number(row.id),
      id_asignatura: Number(row.id_asignatura),
      id_usuario: Number(row.id_usuario),
      nombre: String(row.nombre),
      tipo: String(row.tipo),
      url: String(row.url),
      descripcion: row.descripcion as string | null,
      fecha_subida: String(row.fecha_subida),
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}