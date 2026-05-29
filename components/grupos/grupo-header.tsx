import { Settings } from 'lucide-react'

import type { Grupo, UserRole } from '@/types'
import { Button } from '@/components/ui/button'
import { RoleBadge } from '@/components/shared/role-badge'

interface GrupoHeaderProps {
  grupo: Grupo
  userRole?: UserRole
  showManage?: boolean
}

export function GrupoHeader({ grupo, userRole, showManage = false }: GrupoHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div
          className="flex size-12 items-center justify-center rounded-xl text-white text-xl font-bold"
          style={{ backgroundColor: grupo.color || '#3B82F6' }}
        >
          {grupo.nombre.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{grupo.nombre}</h1>
          <div className="flex items-center gap-2 mt-1">
            {grupo.descripcion && (
              <p className="text-muted-foreground">{grupo.descripcion}</p>
            )}
            {userRole && (
              <span className="text-muted-foreground">
                Tu rol: <RoleBadge role={userRole} className="ml-1" />
              </span>
            )}
          </div>
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
