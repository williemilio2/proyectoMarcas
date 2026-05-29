import type { RecursoTipo } from '@/types'

// Roles del sistema
export const ROLES = {
  PROFESOR: 1,
  ADMINISTRADOR: 2,
  ALUMNO: 3,
  DELEGADO: 4,
  CREADOR: 5,
} as const

export type UserRole = (typeof ROLES)[keyof typeof ROLES]

// Jerarquía de roles (mayor número = más permisos)
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [ROLES.ALUMNO]: 1,
  [ROLES.DELEGADO]: 2,
  [ROLES.PROFESOR]: 3,
  [ROLES.ADMINISTRADOR]: 4,
  [ROLES.CREADOR]: 5,
}

// Etiquetas para roles
export const ROLE_LABELS: Record<UserRole, string> = {
  [ROLES.PROFESOR]: 'Profesor',
  [ROLES.ADMINISTRADOR]: 'Administrador',
  [ROLES.ALUMNO]: 'Alumno',
  [ROLES.DELEGADO]: 'Delegado',
  [ROLES.CREADOR]: 'Creador',
}

// Colores para roles
export const ROLE_COLORS: Record<UserRole, string> = {
  [ROLES.PROFESOR]:
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',

  [ROLES.ADMINISTRADOR]:
    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',

  [ROLES.ALUMNO]:
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',

  [ROLES.DELEGADO]:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',

  [ROLES.CREADOR]:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
}

// Iconos para tipos de recurso
export const RECURSO_TIPO_ICONS: Record<RecursoTipo, string> = {
  pdf: 'FileText',
  imagen: 'Image',
  documento: 'FileText',
  video: 'Video',
  otro: 'File',
}

// Colores predefinidos para grupos/asignaturas
export const PRESET_COLORS = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#84CC16', // lime
]