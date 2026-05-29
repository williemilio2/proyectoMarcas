"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, ArrowLeft, Users } from "lucide-react";
import { useUser } from "@/contexts/user-context";
import { obtenerAsignaturas } from "@/src/actions/obtenerAsignaturas";
import { obtenerRol } from "@/src/actions/obtenerRol";
import { obtenerGrupoById } from "@/src/actions/obtenerGrupoById";
import { AsignaturaList } from "@/components/asignaturas/asignatura-list";
import { AsignaturaCreateDialog } from "@/components/asignaturas/asignatura-create-dialog";
import { MiembrosDialog } from "@/components/miembros/miembros-dialog";
import { obtenerMiembrosGrupo } from "@/src/actions/obtenerMiembrosGrupo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLES } from "@/lib/constants";

interface GrupoPageProps {
  params: Promise<{ grupoId: string }>;
}
interface Miembro {
  id: number;
  nombre: string;
  email: string;
  id_rol: number;
}
interface Asignatura {
  id: number;
  id_grupo: number;
  nombre: string;
  color: string | null;
  descripcion: string | null;
}

interface Grupo {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export default function GrupoPage({ params }: GrupoPageProps) {
  const { grupoId } = use(params);
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();

  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([]);
  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [userRole, setUserRole] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const grupoIdNum = parseInt(grupoId, 10);

  const canCreate =
    userRole === ROLES.ADMINISTRADOR || userRole === ROLES.CREADOR;

  // 🔥 helper seguro para evitar errores de tipos raros (bigint, string, etc.)
  const toNumber = (value: unknown): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string") return Number(value);
    if (typeof value === "bigint") return Number(value);
    return 0; // fallback seguro
  };

  const cargarDatos = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);

    try {
      const [asignaturasData, rolData, grupoData, miembrosData] = await Promise.all([
        obtenerAsignaturas(grupoIdNum),
        obtenerRol(grupoIdNum, user.id),
        obtenerGrupoById(grupoIdNum),
        obtenerMiembrosGrupo(grupoIdNum),
      ]);

      if (rolData === null) {
        router.push("/");
        return;
      }

      setAsignaturas(asignaturasData as Asignatura[]);

      // 🔥 FIX CLAVE
      setUserRole(toNumber(rolData));

      setGrupo(
        grupoData
          ? ({
              id: Number((grupoData as any).id),
              nombre: String((grupoData as any).nombre),
              descripcion: (grupoData as any).descripcion
                ? String((grupoData as any).descripcion)
                : null,
            } as Grupo)
          : null
      );
      setMiembros(miembrosData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  }, [grupoIdNum, user?.id, router]);

  useEffect(() => {
    if (!userLoading && user) {
      cargarDatos();
    }
  }, [userLoading, user, cargarDatos]);

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>

        <div>
          <h1 className="text-2xl font-bold">{grupo?.nombre || "Grupo"}</h1>
          {grupo?.descripcion && (
            <p className="text-muted-foreground">{grupo.descripcion}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Asignaturas</h2>

            {canCreate && (
              <AsignaturaCreateDialog
                grupoId={grupoIdNum}
                onAsignaturaCreated={cargarDatos}
              >
                <Button size="sm">
                  <Plus className="mr-2 size-4" />
                  Nueva Asignatura
                </Button>
              </AsignaturaCreateDialog>
            )}
          </div>

          <AsignaturaList
            asignaturas={asignaturas}
            grupoId={grupoIdNum}
            canCreate={canCreate}
            onAsignaturaCreated={cargarDatos}
          />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="size-4" />
                Información del Grupo
              </CardTitle>
            </CardHeader>

            <CardContent className="text-sm space-y-4">
              <div className="space-y-2">
                <div>
                  <span className="text-muted-foreground">Tu rol: </span>
                  <span className="font-medium">
                    {userRole === ROLES.CREADOR && "Creador"}
                    {userRole === ROLES.ADMINISTRADOR && "Administrador"}
                    {userRole === ROLES.PROFESOR && "Profesor"}
                    {userRole === ROLES.DELEGADO && "Delegado"}
                    {userRole === ROLES.ALUMNO && "Alumno"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Asignaturas: </span>
                  <span className="font-medium">{asignaturas.length}</span>
                </div>
              </div>
                <MiembrosDialog
                  miembros={miembros}
                  grupoId={grupoIdNum}
                  userRole={userRole}
                  currentUserId={user.id}
                  onMiembrosUpdated={cargarDatos}
                  >
                <Button variant="outline" className="w-full">
                  <Users className="mr-2 size-4" />
                  Ver Miembros
                </Button>
              </MiembrosDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}