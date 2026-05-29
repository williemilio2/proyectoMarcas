"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Asignatura {
  id: number;
  id_grupo: number;
  nombre: string;
  color: string | null;
  descripcion: string | null;
}

interface AsignaturaCardProps {
  asignatura: Asignatura;
  grupoId: number;
}

export function AsignaturaCard({ asignatura, grupoId }: AsignaturaCardProps) {
  return (
    <Link href={`/grupos/${grupoId}/asignaturas/${asignatura.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div
              className="size-3 rounded-full"
              style={{ backgroundColor: asignatura.color || "#3b82f6" }}
            />
            <CardTitle className="text-base">{asignatura.nombre}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {asignatura.descripcion || "Sin descripcion"}
          </p>
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <BookOpen className="size-3" />
            <span>Ver recursos</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}