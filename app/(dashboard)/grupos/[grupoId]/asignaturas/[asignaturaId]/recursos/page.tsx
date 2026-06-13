//app/(dashboard)/grupos/[grupoId]/asignaturas/[asignaturaId]/recursos/page.tsx

"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, FileText, Loader2 } from "lucide-react";

import { useUser } from "@/contexts/user-context";
import { obtenerRol } from "@/src/actions/obtenerRol";
import { obtenerGrupoById } from "@/src/actions/obtenerGrupoById";
import { obtenerAsignaturaById } from "@/src/actions/obtenerAsignaturaById";
import { obtenerRecursos } from "@/lib/recursos";
import { RecursoList } from "@/components/recursos/recurso-list";
import { RecursoUploadDialog } from "@/components/recursos/recurso-upload-dialog";
import { Button } from "@/components/ui/button";
import { ROLES } from "@/lib/constants";
import type { Archivo } from "@/types";

interface RecursosPageProps {
  params: Promise<{ grupoId: string; asignaturaId: string }>;
}

interface Grupo {
  id: number;
  nombre: string;
  descripcion: string | null;
}

interface Asignatura {
  id: number;
  id_grupo: number;
  nombre: string;
  color: string | null;
  descripcion: string | null;
}

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

export default function RecursosPage({ params }: RecursosPageProps) {
  const { grupoId, asignaturaId } = use(params);
  const grupoIdNum = parseInt(grupoId);
  const asignaturaIdNum = parseInt(asignaturaId);
  const [archivo, setArchivo] = useState<File | null>(null);
  
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();

  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [asignatura, setAsignatura] = useState<Asignatura | null>(null);
  const [recursos, setRecursos] = useState<Archivo[]>([]);
  const [userRole, setUserRole] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const canUploadRecurso = userRole === ROLES.CREADOR || 
                           userRole === ROLES.ADMINISTRADOR || 
                           userRole === ROLES.PROFESOR ||
                           userRole === ROLES.DELEGADO;

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (user) {
      cargarDatos();
    }
  }, [user, grupoIdNum, asignaturaIdNum]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setArchivo(file);
  };
  async function cargarDatos() {
    if (!user) return;
    
    setLoading(true);
    try {
      const [grupoData, asignaturaData, recursosData, rolData] = await Promise.all([
        obtenerGrupoById(grupoIdNum),
        obtenerAsignaturaById(asignaturaIdNum),
        obtenerRecursos(asignaturaIdNum),
        obtenerRol(grupoIdNum, user.id),
      ]);

      if (!grupoData || rolData === null) {
        router.push("/grupos");
        return;
      }

      if (!asignaturaData) {
        router.push(`/grupos/${grupoIdNum}`);
        return;
      }

      setGrupo(grupoData as Grupo);
      setAsignatura(asignaturaData as Asignatura);
      setRecursos(recursosData);
      setUserRole(rolData as number);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  }

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || !grupo || !asignatura) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/grupos/${grupoId}/asignaturas/${asignaturaId}`}>
              <ArrowLeft className="mr-2 size-4" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="size-5" />
              Recursos de {asignatura.nombre}
            </h1>
            <p className="text-sm text-muted-foreground">{grupo.nombre}</p>
          </div>
        </div>
        {canUploadRecurso && (
          <RecursoUploadDialog 
            asignaturaId={asignaturaIdNum}
            userId={user.id}
            onRecursoUploaded={cargarDatos}
          >
            <Button>
              <Upload className="mr-2 size-4" />
              Subir Recurso
            </Button>
          </RecursoUploadDialog>
        )}
      </div>

      <RecursoList 
        recursos={recursos}
        asignaturaId={asignaturaIdNum}
        userId={user.id}
        canUpload={canUploadRecurso}
        onRecursoChanged={cargarDatos}
      />
    </div>
  );
}