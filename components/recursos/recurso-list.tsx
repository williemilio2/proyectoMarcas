'use client'

import { FileText, Plus } from 'lucide-react'

import { usePermissions } from '@/hooks/use-permissions'
import type { Recurso } from '@/types'
import { RecursoItem } from './recurso-item'
import { RecursoUploadDialog } from './recurso-upload-dialog'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'

interface RecursoListProps {
  recursos: Recurso[]
  asignaturaId: string
}

export function RecursoList({ recursos, asignaturaId }: RecursoListProps) {
  const { filterRecursos, canCreateRecurso } = usePermissions()

  // Filter resources based on user permissions
  const recursosVisibles = filterRecursos(recursos)

  if (recursosVisibles.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="size-6 text-muted-foreground" />}
        title="No hay recursos"
        description={
          recursos.length > 0
            ? 'No tienes permiso para ver los recursos de esta asignatura.'
            : 'Esta asignatura aun no tiene recursos. Sube el primero para comenzar.'
        }
        action={
          canCreateRecurso() && (
            <RecursoUploadDialog asignaturaId={asignaturaId}>
              <Button>
                <Plus className="mr-2 size-4" />
                Subir primer recurso
              </Button>
            </RecursoUploadDialog>
          )
        }
      />
    )
  }

  return (
    <div className="space-y-2">
      {recursosVisibles.map((recurso) => (
        <RecursoItem
          key={recurso.id}
          recurso={recurso}
          onView={(r) => window.open(r.url, '_blank')}
          onDownload={(r) => {
            // In a real app, this would trigger a download
            console.log('Downloading:', r.nombre)
          }}
        />
      ))}
    </div>
  )
}
