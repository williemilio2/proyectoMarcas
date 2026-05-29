"use server";

import { db } from "@/src/lib/db";

export async function obtenerGrupos() {
  try {
    const result = await db.execute({
      sql: `
        SELECT *
        FROM grupos
      `,
      args: [],
    });
    return JSON.parse(JSON.stringify(result.rows));
  } catch (error) {
    console.log(error);
    return [];
  }
}