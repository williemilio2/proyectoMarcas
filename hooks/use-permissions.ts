'use client'

import { useUser } from '@/contexts/user-context'
import * as permissions from '@/lib/permissions'
import type { Recurso } from '@/types'

export function usePermissions() {
  const { currentRole, user } = useUser()

  return {
    canViewRecurso: (recurso: Recurso) =>
      currentRole ? permissions.canViewRecurso(currentRole, recurso) : false,
    canCreateRecurso: () =>
      currentRole ? permissions.canCreateRecurso(currentRole) : false,
    canDeleteRecurso: (recurso: Recurso) =>
      currentRole && user
        ? permissions.canDeleteRecurso(currentRole, recurso, user.id)
        : false,
    canManageGrupo: () =>
      currentRole ? permissions.canManageGrupo(currentRole) : false,
    canCreateAsignatura: () =>
      currentRole ? permissions.canCreateAsignatura(currentRole) : false,
    canEditAsignatura: () =>
      currentRole ? permissions.canEditAsignatura(currentRole) : false,
    filterRecursos: (recursos: Recurso[]) =>
      currentRole
        ? permissions.filterRecursosByPermission(recursos, currentRole)
        : [],
  }
}
