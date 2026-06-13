import { FileText, Image, Video, File, Download, Eye, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { eliminarRecurso } from "@/lib/recursos";
import { getFileTipo, type RecursoTipo } from "@/types";
import type { Archivo } from "@/types";
import { Button } from "@/components/ui/button";
import {obtenerDatosPersona} from "@/src/actions/obtenerDatosPersona"

interface RecursoItemProps {
  archivo: Archivo;
  currentUserId: number;
  onDeleted: () => void;
  puedeEliminar?: boolean;
}

const TIPO_ICONS: Record<RecursoTipo, React.ReactNode> = {
  pdf: <FileText className="size-5 text-red-500" />,
  txt: <FileText className="size-5 text-gray-500" />,
  doc: <FileText className="size-5 text-blue-500" />,
  docx: <FileText className="size-5 text-blue-500" />,
  jpg: <Image className="size-5 text-green-500" />,
  jpeg: <Image className="size-5 text-green-500" />,
  png: <Image className="size-5 text-green-500" />,
  gif: <Image className="size-5 text-green-500" />,
  xlsx: <FileText className="size-5 text-emerald-600" />,
  pptx: <FileText className="size-5 text-orange-500" />,
  mp4: <Video className="size-5 text-purple-500" />,
  otro: <File className="size-5 text-gray-500" />,
};

const TIPO_LABELS: Record<RecursoTipo, string> = {
  pdf: "PDF",
  txt: "Texto",
  doc: "Word",
  docx: "Word",
  jpg: "Imagen",
  jpeg: "Imagen",
  png: "Imagen",
  gif: "Imagen",
  xlsx: "Excel",
  pptx: "PowerPoint",
  mp4: "Video",
  otro: "Archivo",
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return "Fecha desconocida";

  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function RecursoItem({ archivo, currentUserId, onDeleted, puedeEliminar }: RecursoItemProps) {
  const [deleting, setDeleting] = useState(false);
  const [nombre, setNombre] = useState<string | null>(null);
  const tipo = getFileTipo(archivo.nombre) as RecursoTipo;
  const icon = TIPO_ICONS[tipo] ?? TIPO_ICONS.otro;
  const canDelete = archivo.id_alumno === currentUserId ||puedeEliminar;

  const handleView = () => {
    window.open(archivo.url, "_blank");
  };
  useEffect(() => {
    const cargarDatos = async () => {
      const nombreObtenido = await obtenerDatosPersona(
        archivo.id_alumno
      );
      setNombre(nombreObtenido);
    };

    cargarDatos();
    }, []);
const handleDownload = async () => {
  const response = await fetch(archivo.url);

  if (!response.ok) {
    throw new Error("No se pudo descargar el archivo");
  }

  const blob = await response.blob();

  const objectUrl = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = archivo.nombre;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(objectUrl);
};

  const handleDelete = async () => {
    if (!canDelete) return;
    setDeleting(true);
    await eliminarRecurso(archivo.id, currentUserId);
    setDeleting(false);
    onDeleted();
  };

  return (
    <div className="group flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate text-sm">{archivo.nombre}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          <span>{TIPO_LABELS[tipo] ?? "Archivo"}</span>
          <span className="text-zinc-300 dark:text-zinc-600">|</span>
          <span>{formatDate(archivo.fecha_subida)}</span>
        </div>
        <div>
          <p className="text-sm text-gray-500 italic">
            {nombre}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button variant="ghost" size="icon" className="size-8 cursor-pointer" onClick={(handleView)}>
          <Eye className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" className="size-8 cursor-pointer" onClick={handleDownload}>
          <Download className="size-4" />
        </Button>
        {canDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          </Button>
        )}
      </div>
    </div>
  );
}
