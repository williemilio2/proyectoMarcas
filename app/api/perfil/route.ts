import {
  obtenerPerfil,
  obtenerGruposDeAlumno,
  obtenerEstadisticas,
  obtenerRecursosDeAlumno,
} from "@/lib/perfil";

import { getUser } from "@/src/lib/auth";

export async function POST() {
  try {
    console.log("🔥 API /perfil HIT");

    const user = await getUser();

    console.log("👤 USER:", user);

    if (!user) {
      return Response.json(
        { error: "No autenticado" },
        { status: 401 }
      );
    }

    const userId = user.id;

    const [perfil, grupos, stats, recursos] = await Promise.all([
      obtenerPerfil(userId),
      obtenerGruposDeAlumno(userId),
      obtenerEstadisticas(userId),
      obtenerRecursosDeAlumno(userId),
    ]);

    return Response.json({
      perfil,
      grupos,
      stats,
      recursos,
    });

  } catch (error) {
    console.error("💥 ERROR /perfil:", error);

    return Response.json(
      { error: "Error cargando perfil" },
      { status: 500 }
    );
  }
}