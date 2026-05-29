"use server";
import { db } from "@/src/lib/db";
import { ROLES } from "@/lib/constants";

export async function cambiarRolUsuario(
  idGrupo: number,
  idUsuario: number,
  nuevoRol: number,
  idUsuarioActual: number
) {
  try {
    // Obtener el rol del usuario que hace el cambio
    const rolActual = await db.execute({
      sql: `SELECT id_rol FROM rol_usuario WHERE id_usuario = ? AND id_grupo = ?`,
      args: [idUsuarioActual, idGrupo],
    });

    const miRol = rolActual.rows[0]?.id_rol as number | undefined;

    if (!miRol) {
      return { success: false, error: "No tienes permisos en este grupo" };
    }

    // Verificar permisos segun el rol
    // Creador (5): puede dar cualquier rol menos Creador
    // Admin (2): puede dar cualquier rol menos Creador y Admin
    if (miRol === ROLES.CREADOR) {
      if (nuevoRol === ROLES.CREADOR) {
        return { success: false, error: "No puedes asignar el rol de Creador" };
      }
    } else if (miRol === ROLES.ADMINISTRADOR) {
      if (nuevoRol === ROLES.CREADOR || nuevoRol === ROLES.ADMINISTRADOR) {
        return { success: false, error: "No puedes asignar ese rol" };
      }
    } else {
      return { success: false, error: "No tienes permisos para cambiar roles" };
    }

    // No permitir cambiar el rol del creador
    const rolObjetivo = await db.execute({
      sql: `SELECT id_rol FROM rol_usuario WHERE id_usuario = ? AND id_grupo = ?`,
      args: [idUsuario, idGrupo],
    });

    const rolDelUsuario = rolObjetivo.rows[0]?.id_rol as number | undefined;
    
    if (rolDelUsuario === ROLES.CREADOR) {
      return { success: false, error: "No puedes cambiar el rol del creador" };
    }

    // Si soy admin, no puedo cambiar el rol de otro admin
    if (miRol === ROLES.ADMINISTRADOR && rolDelUsuario === ROLES.ADMINISTRADOR) {
      return { success: false, error: "No puedes cambiar el rol de otro administrador" };
    }

    // Actualizar el rol
    await db.execute({
      sql: `UPDATE rol_usuario SET id_rol = ? WHERE id_usuario = ? AND id_grupo = ?`,
      args: [nuevoRol, idUsuario, idGrupo],
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Error al cambiar el rol" };
  }
}