import type { UserRole, Recurso } from '@/types'
import { ROLE_HIERARCHY } from './constants'

// Verificar si usuario puede ver un recurso
export function canViewRecurso(userRole: UserRole, recurso: Recurso): boolean {
  // Si no hay restricción de roles, todos pueden ver
  if (!recurso.visibilidad.roles) return true

  // Si el rol del usuario está en la lista permitida
  return recurso.visibilidad.roles.includes(userRole)
}

// Verificar si usuario puede crear/subir recursos
export function canCreateRecurso(userRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY.profesor
}

// Verificar si usuario puede eliminar recursos
export function canDeleteRecurso(
  userRole: UserRole,
  recurso: Recurso,
  userId: string
): boolean {
  // Admin puede eliminar cualquier recurso
  if (userRole === 'admin') return true
  // El creador puede eliminar su propio recurso
  return recurso.createdBy === userId
}

// Verificar si usuario puede gestionar el grupo
export function canManageGrupo(userRole: UserRole): boolean {
  return userRole === 'admin'
}

// Verificar si usuario puede crear asignaturas
export function canCreateAsignatura(userRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY.profesor
}

// Verificar si usuario puede editar una asignatura
export function canEditAsignatura(userRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY.profesor
}

// Filtrar recursos visibles para un usuario
export function filterRecursosByPermission(
  recursos: Recurso[],
  userRole: UserRole
): Recurso[] {
  return recursos.filter((r) => canViewRecurso(userRole, r))
}
