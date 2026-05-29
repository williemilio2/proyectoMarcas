"use server";

import { db } from "@/src/lib/db";

export async function crearGrupo(
  nombre: string,
  descripcion: string,
  selectedColor: string
) {

    try{
        const result = await db.execute({
            sql: `
                INSERT INTO GRUPOS (nombre, descripcion, color)
                VALUES (?,?,?)
            `,args: [nombre, descripcion, selectedColor]
        });
      return {
        success: true,
        message: "",
        grupoId: Number(
          result.lastInsertRowid
        ),
      };
    }

  catch(error)
    {
        console.log(error);
      return {
        success: false,
        message: "Error creando grupo",
      };
    }
}