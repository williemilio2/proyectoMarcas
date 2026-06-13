"use server";

import { db } from "@/src/lib/db";
import { ROLES } from "@/lib/constants";

/* =======================
   SAFE HELPERS
======================= */

const safeRows = <T>(rows: unknown): T[] => {
  if (!Array.isArray(rows)) return [];
  return rows as T[];
};

const toNumber = (value: unknown, fallback = 0): number => {
  if (value === null || value === undefined) return fallback;
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
};

const toString = (value: unknown, fallback = ""): string => {
  if (value === null || value === undefined) return fallback;
  return String(value);
};

/* =======================
   TIPOS
======================= */

export interface Alumno {
  id: number;
  nombre: string;
  email: string;
  avatar_url: string | null;
  created_at: string | null;
}

export interface GrupoConRol {
  id: number;
  nombre: string;
  descripcion: string | null;
  rol: number;
  rolLabel: string;
}

export interface EstadisticasPerfil {
  totalRecursos: number;
  totalGrupos: number;
  totalAsignaturas: number;
  rolMasAlto: number;
  rolMasAltoLabel: string;
}

/* =======================
   ROLES
======================= */

const ROL_LABELS: Record<number, string> = {
  [ROLES.ALUMNO]: "Alumno",
  [ROLES.DELEGADO]: "Delegado",
  [ROLES.PROFESOR]: "Profesor",
  [ROLES.ADMINISTRADOR]: "Administrador",
  [ROLES.CREADOR]: "Creador",
};

/* =======================
   PERFIL
======================= */

export async function obtenerPerfil(userId: number): Promise<Alumno | null> {
  try {
    const result = await db.execute({
      sql: `
        SELECT id, nombre, email
        FROM usuarios
        WHERE id = ?
      `,
      args: [userId],
    });

    const rows = safeRows<any>(result.rows);
    if (!rows.length) return null;

    const row = rows[0];

    return {
      id: toNumber(row.id),
      nombre: toString(row.nombre),
      email: toString(row.email),
      avatar_url: null,
      created_at: null,
    };
  } catch (error) {
    console.error("obtenerPerfil error:", error);
    return null;
  }
}

/* =======================
   GRUPOS (FIX REAL)
======================= */

export async function obtenerGruposDeAlumno(
  userId: number
): Promise<GrupoConRol[]> {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          g.id,
          g.nombre,
          g.descripcion,
          ru.id_rol
        FROM grupos g
        INNER JOIN rol_usuario ru ON g.id = ru.id_grupo
        WHERE ru.id_usuario = ?
        ORDER BY ru.id_rol DESC, g.nombre ASC
      `,
      args: [userId],
    });

    const rows = safeRows<any>(result.rows);

    return rows.map((row) => {
      const rol = toNumber(row.id_rol, 1);

      return {
        id: toNumber(row.id),
        nombre: toString(row.nombre),
        descripcion: row.descripcion ? toString(row.descripcion) : null,
        rol,
        rolLabel: ROL_LABELS[rol] ?? "Alumno",
      };
    });
  } catch (error) {
    console.error("obtenerGruposDeAlumno error:", error);
    return [];
  }
}

/* =======================
   ESTADÍSTICAS (FIX REAL)
======================= */

export async function obtenerEstadisticas(
  userId: number
): Promise<EstadisticasPerfil> {
  try {
    const [recursosRes, gruposRes, asignaturasRes] = await Promise.all([
      db.execute({
        sql: `
          SELECT COUNT(*) as total 
          FROM archivos 
          WHERE id_alumno = ?
        `,
        args: [userId],
      }),

      db.execute({
        sql: `
          SELECT COUNT(*) as total, MAX(id_rol) as max_rol
          FROM rol_usuario
          WHERE id_usuario = ?
        `,
        args: [userId],
      }),

      db.execute({
        sql: `
          SELECT COUNT(DISTINCT a.id) as total
          FROM asignaturas a
          INNER JOIN rol_usuario ru ON a.id_grupo = ru.id_grupo
          WHERE ru.id_usuario = ?
        `,
        args: [userId],
      }),
    ]);

    const recursosRows = safeRows<any>(recursosRes.rows);
    const gruposRows = safeRows<any>(gruposRes.rows);
    const asignaturasRows = safeRows<any>(asignaturasRes.rows);

    const totalRecursos = toNumber(recursosRows[0]?.total);
    const totalGrupos = toNumber(gruposRows[0]?.total);
    const totalAsignaturas = toNumber(asignaturasRows[0]?.total);
    const maxRol = toNumber(gruposRows[0]?.max_rol, 1);

    return {
      totalRecursos,
      totalGrupos,
      totalAsignaturas,
      rolMasAlto: maxRol,
      rolMasAltoLabel: ROL_LABELS[maxRol] ?? "Alumno",
    };
  } catch (error) {
    console.error("obtenerEstadisticas error:", error);

    return {
      totalRecursos: 0,
      totalGrupos: 0,
      totalAsignaturas: 0,
      rolMasAlto: 1,
      rolMasAltoLabel: "Alumno",
    };
  }
}

/* =======================
   RECURSOS (SIN CAMBIOS NECESARIOS)
======================= */

export async function obtenerRecursosDeAlumno(userId: number) {
  try {
    const result = await db.execute({
      sql: `
        SELECT a.nombre, a.tipo, asig.nombre as asignatura_nombre
        FROM archivos a
        LEFT JOIN asignaturas asig ON a.asignatura_id = asig.id
        WHERE a.id_alumno = ?
        ORDER BY a.id DESC
        LIMIT 10
      `,
      args: [userId],
    });

    const rows = safeRows<any>(result.rows);

    return rows.map((row) => ({
      nombre: toString(row.nombre),
      tipo: toString(row.tipo, "otro"),
      asignatura_nombre: toString(row.asignatura_nombre, "Sin asignatura"),
    }));
  } catch (error) {
    console.error("obtenerRecursosDeAlumno error:", error);
    return [];
  }
}