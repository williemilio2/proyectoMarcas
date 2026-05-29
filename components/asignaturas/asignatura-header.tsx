import { Settings } from 'lucide-react'

import type { Asignatura, Grupo } from '@/types'
import { Button } from '@/components/ui/button'

interface AsignaturaHeaderProps {
  asignatura: Asignatura
  grupo: Grupo
  showManage?: boolean
}

export function AsignaturaHeader({
  asignatura,
  grupo,
  showManage = false,
}: AsignaturaHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div
          className="flex size-12 items-center justify-center rounded-xl text-white text-xl font-bold"
          style={{ backgroundColor: asignatura.color || '#3B82F6' }}
        >
          {asignatura.nombre.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{asignatura.nombre}</h1>
          <p className="text-muted-foreground">
            Grupo: {grupo.nombre}
            {asignatura.descripcion && ` - ${asignatura.descripcion}`}
          </p>
        </div>
      </div>
      {showManage && (
        <Button variant="outline" size="sm">
          <Settings className="mr-2 size-4" />
          Gestionar
        </Button>
      )}
    </div>
  )
}
