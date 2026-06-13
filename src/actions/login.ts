"use server";

import { db } from "@/src/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

async function cuentaExistente(correo: string)
{
    const result = await db.execute({
    sql: `
        SELECT *
        FROM usuarios
        WHERE email = ?
    `,
    args: [correo],
    });
    if(result.rows[0] != null)
    {
        return result.rows[0]
    }
}
async function verVerificacion(id: number)
{
    const result = await db.execute({
    sql: `
        SELECT *
        FROM usuarios_verificacion
        WHERE id_usuario = ?
    `,
    args: [id],
    });
    if(result.rows[0] != null)
    {
        return result.rows[0]
    }
}
export async function loginUser(
  email: string,
  password: string
) {
    var resultado = await cuentaExistente(email)
    if(resultado)
    {
        const id = Number((resultado as any).id);
        var resultadoVerificacion = await verVerificacion(id);
        if (resultadoVerificacion && resultadoVerificacion.verificado !== 1) {
            return {
                success: false,
                message: "Debes verificar tu correo antes de iniciar sesión",
            };
            }
        const validPassword =
        await bcrypt.compare(
            password,
            resultado.password as string
        );
        if(validPassword)
        {
            //Crear cooqie
             const token = jwt.sign(
                {
                id: resultado.id,
                email: resultado.email,
                },
                process.env.JWT_SECRET!,
                {
                expiresIn: "14d",
                }
            );
            const cookieStore = await cookies()

            cookieStore.set("accountToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 14,
            })


            return {
                success: true,
                message: "",
            };
        }
        else{
            return {
                success: false,
                message: "Inicio sesión fallido",
            };
        }
    }
    else{
        return {
            success: false,
            message: "Inicio sesión fallido",
        };
    }
}