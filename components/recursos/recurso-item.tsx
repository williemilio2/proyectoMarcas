import { FileText, Image, Video, File, Download, Eye, Trash2, Lock } from 'lucide-react'

import { usePermissions } from '@/hooks/use-permissions'
import type { Recurso, UserRole } from '@/types'
import { Button } from '@/components/ui/button'
import { RoleBadge } from '@/components/shared/role-badge'
import { cn } from '@/lib/utils'

interface RecursoItemProps {
  recurso: Recurso
  onView?: (recurso: Recurso) => void
  onDownload?: (recurso: Recurso) => void
  onDelete?: (recurso: Recurso) => void
}

const TIPO_ICONS: Record<string, React.ReactNode> = {
  pdf: <FileText className="size-5 text-red-500" />,
  documento: <FileText className="size-5 text-blue-500" />,
  imagen: <Image className="size-5 text-green-500" />,
  video: <Video className="size-5 text-purple-500" />,
  otro: <File className="size-5 text-gray-500" />,
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getVisibilityLabel(recurso: Recurso): string {
  if (!recurso.visibilidad.roles) return 'Todos'
  if (recurso.visibilidad.roles.includes('alumno')) return 'Todos'
  if (recurso.visibilidad.roles.includes('profesor')) return 'Profesores'
  return 'Admin'
}

export function RecursoItem({
  recurso,
  onView,
  onDownload,
  onDelete,
}: RecursoItemProps) {
  const { canDeleteRecurso } = usePermissions()
  const isRestricted = recurso.visibilidad.roles !== null

  return (
    <div className="group flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50">
      <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
        {TIPO_ICONS[recurso.tipo] || TIPO_ICONS.otro}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate">{recurso.nombre}</p>
          {isRestricted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
              <Lock className="size-3" />
              {getVisibilityLabel(recurso)}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {formatFileSize(recurso.size)}
        </p>
      </div>

      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        {onView && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => onView(recurso)}
          >
            <Eye className="size-4" />
            <span className="sr-only">Ver</span>
          </Button>
        )}
        {onDownload && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => onDownload(recurso)}
          >
            <Download className="size-4" />
            <span className="sr-only">Descargar</span>
          </Button>
        )}
        {onDelete && canDeleteRecurso(recurso) && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(recurso)}
          >
            <Trash2 className="size-4" />
            <span className="sr-only">Eliminar</span>
          </Button>
        )}
      </div>
    </div>
  )
}
