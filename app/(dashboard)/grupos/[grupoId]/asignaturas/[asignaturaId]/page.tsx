//app/(dashboard)/grupos/[grupoId]/asignaturas/[asignaturaId]/page.tsx

"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Upload, MessageCircle, ArrowLeft, FileText, Loader2 } from "lucide-react";

import { useUser } from "@/contexts/user-context";
import { obtenerRol } from "@/src/actions/obtenerRol";
import { obtenerGrupoById } from "@/src/actions/obtenerGrupoById";
import { obtenerAsignaturaById } from "@/src/actions/obtenerAsignaturaById";
import { obtenerRecursos } from "@/lib/recursos";
import { RecursoList } from "@/components/recursos/recurso-list";
import { RecursoUploadDialog } from "@/components/recursos/recurso-upload-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLES } from "@/lib/constants";
import type { Archivo } from "@/types";

interface AsignaturaPageProps {
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

export default function AsignaturaPage({ params }: AsignaturaPageProps) {
  const { grupoId, asignaturaId } = use(params);
  const grupoIdNum = parseInt(grupoId);
  const asignaturaIdNum = parseInt(asignaturaId);

  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();

  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [asignatura, setAsignatura] = useState<Asignatura | null>(null);
  const [recursos, setRecursos] = useState<Archivo[]>([]);
  const [userRole, setUserRole] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

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
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="cursor-pointer"> 
            <Link href={`/grupos/${grupoId}`}>
              <ArrowLeft className="mr-2 size-4" />
              Volver
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              {asignatura.color && (
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: asignatura.color }}
                />
              )}
              <h1 className="text-2xl font-bold">{asignatura.nombre}</h1>
            </div>
            <p className="text-sm text-muted-foreground">{grupo.nombre}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recursos Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="size-5" />
              Recursos
            </h2>
              <RecursoUploadDialog 
                asignaturaId={asignaturaIdNum}
                userId={user.id}
                onRecursoUploaded={cargarDatos}
              >
                <Button size="sm" className="cursor-pointer">
                  <Upload className="mr-2 size-4" />
                  Subir Recurso
                </Button>
              </RecursoUploadDialog>
          </div>
          <RecursoList 
              recursos={recursos}
              asignaturaId={asignaturaIdNum}
              userId={user.id}
              onRecursoChanged={cargarDatos}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informacion</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              {asignatura.descripcion && (
                <p className="text-muted-foreground">{asignatura.descripcion}</p>
              )}
              <div>
                <span className="text-muted-foreground">Total recursos: </span>
                <span className="font-medium">{recursos.length}</span>
              </div>
            </CardContent>
          </Card>
              {/*
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageCircle className="size-4" />
                Chat de Asignatura
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/grupos/${grupoId}/asignaturas/${asignaturaId}/chat`}>
                  <MessageCircle className="mr-2 size-4" />
                  Abrir Chat
                </Link>
              </Button>
            </CardContent>
          </Card>*/}
        </div>
      </div>
    </div>
  );
}