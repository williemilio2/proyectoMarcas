import { FileText, Upload } from "lucide-react";
import { RecursoItem } from "./recurso-item";
import { RecursoUploadDialog } from "./recurso-upload-dialog";
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import type { Archivo } from "@/types";
import {obtenerRol} from "@/src/actions/obtenerRol"
import {obtenerGrupoPorAsignatura} from "@/src/actions/obtenerGrupoPorAsignatura"

interface RecursoListProps {
  recursos: Archivo[];
  asignaturaId: number;
  userId: number;
  onRecursoChanged: () => void;
}

export function RecursoList({
  recursos,
  asignaturaId,
  userId,
  onRecursoChanged,
}: RecursoListProps) {
  const [rol, setRol] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const deleter = rol === 5 || rol === 2;

  const recursosFiltrados = recursos.filter((archivo) =>
    archivo.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

useEffect(() => {
  const obtenerDatoRol = async () => {
    const grupoObtenido = await obtenerGrupoPorAsignatura(asignaturaId);

    if (grupoObtenido !== null) {
      const rolObtenido = await obtenerRol(
        grupoObtenido,
        userId
      );

      setRol(
        rolObtenido !== null
          ? Number(rolObtenido)
          : null
      );
    }
  };

  obtenerDatoRol();
}, [asignaturaId, userId]);
  if (recursos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 p-12 text-center dark:border-zinc-700 dark:bg-zinc-900/50">
        <div className="flex size-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <FileText className="size-7 text-zinc-400" />
        </div>
        <div>
          <p className="text-sm font-medium">No hay recursos todavia</p>
          <p className="text-xs text-muted-foreground mt-1">
            Sube el primer archivo para empezar a compartir materiales.
          </p>
        </div>
          <RecursoUploadDialog
            asignaturaId={asignaturaId}
            userId={userId}
            onRecursoUploaded={onRecursoChanged}
          >
            <Button size="sm">
              <Upload className="mr-2 size-4" />
              Subir primer recurso
            </Button>
          </RecursoUploadDialog>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="mb-3">
        <input
          type="text"
          placeholder="Buscar recursos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-zinc-900"
        />
      </div>
      {recursosFiltrados.map((archivo) => (
        <RecursoItem
          key={archivo.id}
          archivo={archivo}
          currentUserId={userId}
          onDeleted={onRecursoChanged}
          puedeEliminar={deleter}
        />
      ))}
    </div>
  );
}
