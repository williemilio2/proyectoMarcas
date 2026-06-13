"use server";

import { db } from "@/src/lib/db";
import { supabase } from "@/src/lib/supabase";
import { getFileTipo } from "@/types";
import type { Archivo } from "@/types";

const safeRows = <T>(rows: any[]): T[] =>
  JSON.parse(JSON.stringify(rows));

export async function subirRecurso(
  file: File,
  asignaturaId: number,
  userId: number
): Promise<{ success: boolean; archivo?: Archivo; error?: string }> {
  try {
    const tipo = getFileTipo(file.name);

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

    const filePath = `asignatura-${asignaturaId}/${timestamp}-${sanitizedName}`;

    // Subir a Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("recursos")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);

      return {
        success: false,
        error: "Error al subir el archivo",
      };
    }

    // Obtener URL pública
    const { data } = supabase.storage
      .from("recursos")
      .getPublicUrl(filePath);

    const publicUrl = data.publicUrl;

    // Guardar metadata en Turso
    const result = await db.execute({
      sql: `
        INSERT INTO archivos
        (nombre, url, tipo, asignatura_id, id_alumno)
        VALUES (?, ?, ?, ?, ?)
      `,
      args: [
        file.name,
        publicUrl,
        tipo,
        asignaturaId,
        userId,
      ],
    });

    const archivo: Archivo = {
      id: Number(result.lastInsertRowid),
      nombre: file.name,
      url: publicUrl,
      tipo,
      asignatura_id: asignaturaId,
      id_alumno: userId,
      fecha_subida: new Date().toISOString(),
    };

    return {
      success: true,
      archivo,
    };
  } catch (error) {
    console.error("subirRecurso error:", error);

    return {
      success: false,
      error: "Error inesperado al subir el recurso",
    };
  }
}

export async function obtenerRecursos(
  asignaturaId: number
): Promise<Archivo[]> {
  try {
    const result = await db.execute({
      sql: `
        SELECT
          id,
          nombre,
          url,
          tipo,
          asignatura_id,
          id_alumno,
          fecha_subida
        FROM archivos
        WHERE asignatura_id = ?
        ORDER BY fecha_subida
      `,
      args: [asignaturaId],
    });

    const rows = safeRows<any>(result.rows);

    return rows.map((row) => ({
      id: Number(row.id),
      nombre: String(row.nombre ?? ""),
      url: String(row.url ?? ""),
      tipo: String(row.tipo ?? "otro"),
      asignatura_id: Number(row.asignatura_id),
      id_alumno: Number(row.id_alumno),
      fecha_subida: row.fecha_subida
        ? String(row.fecha_subida)
        : undefined,
    }));
  } catch (error) {
    console.error("obtenerRecursos error:", error);
    return [];
  }
}

export async function eliminarRecurso(
  archivoId: number,
  userId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const fetchResult = await db.execute({
      sql: `
        SELECT *
        FROM archivos
        WHERE id = ?
        AND id_alumno = ?
      `,
      args: [archivoId, userId],
    });

    const rows = safeRows<any>(fetchResult.rows);

    if (rows.length === 0) {
      return {
        success: false,
        error: "Archivo no encontrado o sin permisos",
      };
    }

    const archivo = rows[0];

    // Intentar borrar también del Storage
    try {
      const url = new URL(archivo.url);

      const parts = url.pathname.split("/");

      const bucketIndex = parts.indexOf("recursos");

      if (bucketIndex !== -1) {
        const filePath = parts.slice(bucketIndex + 1).join("/");

        await supabase.storage
          .from("recursos")
          .remove([filePath]);
      }
    } catch (err) {
      console.error("Error eliminando archivo de Storage:", err);
    }

    await db.execute({
      sql: `
        DELETE FROM archivos
        WHERE id = ?
        AND id_alumno = ?
      `,
      args: [archivoId, userId],
    });

    return { success: true };
  } catch (error) {
    console.error("eliminarRecurso error:", error);

    return {
      success: false,
      error: "Error inesperado al eliminar el recurso",
    };
  }
}