"use client";

import { BookOpen, Plus } from "lucide-react";
import { AsignaturaCard } from "./asignatura-card";
import { AsignaturaCreateDialog } from "./asignatura-create-dialog";
import { Button } from "@/components/ui/button";

interface Asignatura {
  id: number;
  id_grupo: number;
  nombre: string;
  color: string | null;
  descripcion: string | null;
}

interface AsignaturaListProps {
  asignaturas: Asignatura[];
  grupoId: number;
  canCreate: boolean;
  onAsignaturaCreated?: () => void;
}

export function AsignaturaList({
  asignaturas,
  grupoId,
  canCreate,
  onAsignaturaCreated,
}: AsignaturaListProps) {
  if (asignaturas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BookOpen className="size-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No hay asignaturas</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Este grupo aun no tiene asignaturas. Crea la primera para comenzar.
        </p>
        {canCreate && (
          <AsignaturaCreateDialog
            grupoId={grupoId}
            onAsignaturaCreated={onAsignaturaCreated}
          >
            <Button>
              <Plus className="mr-2 size-4" />
              Crear primera asignatura
            </Button>
          </AsignaturaCreateDialog>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {asignaturas.map((asignatura) => (
        <AsignaturaCard
          key={asignatura.id}
          asignatura={asignatura}
          grupoId={grupoId}
        />
      ))}
    </div>
  );
}