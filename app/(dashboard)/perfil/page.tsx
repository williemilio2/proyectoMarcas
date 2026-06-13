'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  FolderOpen,
  FileText,
  Upload,
  Shield,
  ChevronRight,
  LogOut ,
  Loader2,
} from "lucide-react";

import {
  type Alumno,
  type GrupoConRol,
  type EstadisticasPerfil,
} from "@/lib/perfil";

import { ROLES } from "@/lib/constants";
import { getFileTipo, type RecursoTipo } from "@/types";
import { Button } from "@/components/ui/button";

const ROL_COLORS: Record<number, string> = {
  [ROLES.ALUMNO]: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  [ROLES.DELEGADO]: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  [ROLES.PROFESOR]: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  [ROLES.ADMINISTRADOR]: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  [ROLES.CREADOR]: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

const TIPO_COLORS: Record<RecursoTipo, string> = {
  pdf: "text-red-500",
  txt: "text-zinc-500",
  doc: "text-blue-500",
  docx: "text-blue-500",
  jpg: "text-green-500",
  jpeg: "text-green-500",
  png: "text-green-500",
  gif: "text-green-500",
  xlsx: "text-emerald-600",
  pptx: "text-orange-500",
  mp4: "text-purple-500",
  otro: "text-zinc-400",
};
export default function PerfilPage() {

  const [alumno, setAlumno] = useState<Alumno | null>(null);
  const [grupos, setGrupos] = useState<GrupoConRol[]>([]);
  const [stats, setStats] = useState<EstadisticasPerfil | null>(null);
  const [recursosRecientes, setRecursosRecientes] = useState<
    { nombre: string; tipo: string; asignatura_nombre: string }[]
  >([]);
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  function getInitials(nombre: string): string {
    const parts = nombre.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return nombre.slice(0, 2).toUpperCase();
  }

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Desconocida";
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

  async function cerrarSesion(){
        const response = await fetch(
      '/api/auth/logout/',
      {
        method: 'POST',
        credentials: 'include',
      }
    )
    if(response.ok)
    {
      router.push("/login");
    }
  };

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        console.log("🚀 Fetch /api/perfil");

        const res = await fetch("/api/perfil", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 🔥 IMPORTANTE
          body: JSON.stringify({}), // 👈 ya NO mandamos userId
        });

        console.log("📡 Status:", res.status);

        const text = await res.text();
        console.log("📦 RAW:", text);

        if (!res.ok) {
          throw new Error("Error cargando perfil");
        }

        const data = JSON.parse(text);

        setAlumno(data.perfil);
        setGrupos(data.grupos);
        setStats(data.stats);
        setRecursosRecientes(data.recursos);

      } catch (err) {
        console.error("❌ Error cargando perfil:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!alumno) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <User className="size-12 text-zinc-300" />
        <p>No se encontró el perfil</p>
        <Button onClick={() => router.push('/')}>Volver</Button>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-space-between gap-4 mb-2">
          <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => router.push('/')}>
            <ChevronRight className="mr-2 size-4 rotate-180" />  
            Volver
          </Button>
        </div>

        {/* Profile Card */}
        <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-zinc-700 dark:to-zinc-900" />
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-5">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-zinc-100 text-2xl font-bold text-zinc-700 dark:border-zinc-900 dark:bg-zinc-800 dark:text-zinc-200 shadow-lg">
                {alumno.avatar_url ? (
                  <img
                    src={alumno.avatar_url}
                    alt={alumno.nombre}
                    className="size-full rounded-2xl object-cover"
                  />
                ) : (
                  getInitials(alumno.nombre)
                )}
              </div>
              <div className="pb-1 min-w-0 flex-1">
                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {alumno.nombre}
                </h1>
                <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  <Mail className="size-3.5" />
                  <span className="truncate">{alumno.email}</span>
                </div>
              </div>
                <Button onClick={cerrarSesion} className=" cursor-pointer">
                  <LogOut  className="mr-2 size-4" />
                </Button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30">
                  <Upload className="size-4 text-blue-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.totalRecursos}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Recursos subidos</p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
                  <FolderOpen className="size-4 text-emerald-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.totalGrupos}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Grupos</p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/30">
                  <BookOpen className="size-4 text-amber-500" />
                </div>
              </div>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.totalAsignaturas}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Asignaturas</p>
            </div>
          </div>
        )}

        {/* Two column layout */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Groups */}
          <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <Shield className="size-4 text-zinc-500" />
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Mis Grupos</h2>
              <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {grupos.length}
              </span>
            </div>
            {grupos.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <FolderOpen className="size-8 text-zinc-300 mx-auto mb-2" />
                <p className="text-sm text-zinc-500">No estas en ningun grupo</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {grupos.map((grupo) => (
                  <div key={grupo.id} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                      <FolderOpen className="size-4 text-zinc-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
                        {grupo.nombre}
                      </p>
                      {grupo.descripcion && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                          {grupo.descripcion}
                        </p>
                      )}
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${ROL_COLORS[grupo.rol] ?? ROL_COLORS[ROLES.ALUMNO]}`}>
                      {grupo.rolLabel}  
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent resources */}
          <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <FileText className="size-4 text-zinc-500" />
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Ultimos Recursos</h2>
              <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {stats?.totalRecursos ?? 0}
              </span>
            </div>
            {recursosRecientes.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <Upload className="size-8 text-zinc-300 mx-auto mb-2" />
                <p className="text-sm text-zinc-500">No has subido recursos todavia</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {recursosRecientes.map((recurso, i) => {
                  const tipo = getFileTipo(recurso.nombre) as RecursoTipo;
                  return (
                    <div key={i} className="flex items-center gap-3 px-5 py-3">
                      <FileText className={`size-4 shrink-0 ${TIPO_COLORS[tipo] ?? "text-zinc-400"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
                          {recurso.nombre}
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                          {recurso.asignatura_nombre}
                        </p>
                      </div>
                      <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 uppercase">
                        {tipo}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Account info */}
        <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <User className="size-4 text-zinc-500" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Informacion de la cuenta</h2>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            <div className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <User className="size-4" />
                Nombre
              </div>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{alumno.nombre}</span>
            </div>
            <div className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <Mail className="size-4" />
                Email
              </div>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{alumno.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
