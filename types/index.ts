// Roles del sistema
export type UserRole = 1 | 2 | 3 | 4 | 5;

// Usuario
export interface User {
  id: string
  nombre: string
  email: string
  avatar?: string
}

// Membresía de un usuario en un grupo
export interface GrupoMember {
  userId: string
  grupoId: string
  role: UserRole
  user?: User
}

// Grupo
export interface Grupo {
  id: number
  nombre: string
  descripcion?: string
  imagen?: string
  color?: string
  createdAt: Date
  members?: GrupoMember[]
}

// Asignatura
export interface Asignatura {
  id: string
  grupoId: string
  nombre: string
  descripcion?: string
  color?: string
  createdAt: Date
}

// Restricción de visibilidad de recurso
export interface RecursoVisibilidad {
  roles: UserRole[] | null // null = todos pueden ver
}

// Tipo de recurso
export type RecursoTipo = 'pdf' | 'imagen' | 'documento' | 'video' | 'otro'

// Recurso
export interface Recurso {
  id: string
  asignaturaId: string
  nombre: string
  tipo: RecursoTipo
  url: string
  size: number
  visibilidad: RecursoVisibilidad
  createdAt: Date
  createdBy: string
}

// Mensaje de chat
export interface ChatMessage {
  id: string
  contextType: 'grupo' | 'asignatura'
  contextId: string // grupoId o asignaturaId
  userId: string
  user?: User
  contenido: string
  createdAt: Date
}

// Contexto del usuario actual en la app
export interface UserContextType {
  user: User | null
  isLoading: boolean
  grupos: Grupo[]
  currentGrupo: Grupo | null
  currentRole: UserRole | null
  setCurrentGrupo: (grupo: Grupo | null) => void
}
