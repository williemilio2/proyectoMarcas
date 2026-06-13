"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { crearAsignatura } from "@/src/actions/crearAsignatura";
import { PRESET_COLORS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AsignaturaCreateDialogProps {
  grupoId: number;
  children?: React.ReactNode;
  onAsignaturaCreated?: () => void;
}

export function AsignaturaCreateDialog({
  grupoId,
  children,
  onAsignaturaCreated,
}: AsignaturaCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setLoading(true);
    try {
      const result = await crearAsignatura(
        grupoId,
        nombre.trim(),
        descripcion.trim() || null,
        selectedColor
      );

      if (result.success) {
        setNombre("");
        setDescripcion("");
        setSelectedColor(PRESET_COLORS[0]);
        setOpen(false);
        onAsignaturaCreated?.();
      }
    } catch (error) {
      console.error("Error al crear asignatura:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="mr-2 size-4" />
            Nueva Asignatura
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Nueva Asignatura</DialogTitle>
            <DialogDescription>
              Agrega una nueva asignatura a este grupo para organizar los
              recursos y comunicacion.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre de la asignatura</Label>
              <Input
                id="nombre"
                placeholder="Ej: Algebra Lineal"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripcion (opcional)</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe el contenido de esta asignatura..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "size-8 rounded-full transition-all cursor-pointer",
                      selectedColor === color
                        ? "ring-2 ring-offset-2 ring-primary"
                        : "hover:scale-110"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!nombre.trim() || loading} className="cursor-pointer">
              {loading ? "Creando..." : "Crear Asignatura"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}