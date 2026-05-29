'use client'

import { useState } from 'react'
import { Plus, Upload, FileText, Image, Video, File, Lock } from 'lucide-react'

import { useUser } from '@/contexts/user-context'
import type { RecursoTipo, UserRole } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

interface RecursoUploadDialogProps {
  asignaturaId: string
  children?: React.ReactNode
}

const TIPO_OPTIONS: { value: RecursoTipo; label: string; icon: React.ReactNode }[] = [
  { value: 'pdf', label: 'PDF', icon: <FileText className="size-4" /> },
  { value: 'documento', label: 'Documento', icon: <FileText className="size-4" /> },
  { value: 'imagen', label: 'Imagen', icon: <Image className="size-4" /> },
  { value: 'video', label: 'Video', icon: <Video className="size-4" /> },
  { value: 'otro', label: 'Otro', icon: <File className="size-4" /> },
]

const VISIBILITY_OPTIONS: { value: UserRole | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Visible para todos' },
  { value: 'profesor', label: 'Solo profesores y admin' },
  { value: 'admin', label: 'Solo administradores' },
]

export function RecursoUploadDialog({
  asignaturaId,
  children,
}: RecursoUploadDialogProps) {
  const { addRecurso } = useUser()
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState<RecursoTipo>('pdf')
  const [visibilidad, setVisibilidad] = useState<UserRole | 'todos'>('todos')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) return

    const roles: UserRole[] | null =
      visibilidad === 'todos'
        ? null
        : visibilidad === 'profesor'
        ? ['admin', 'profesor']
        : ['admin']

    addRecurso(asignaturaId, {
      nombre: nombre.trim(),
      tipo,
      url: `/recursos/${Date.now()}.${tipo}`,
      size: Math.floor(Math.random() * 10000000) + 100000,
      visibilidad: { roles },
    })

    setNombre('')
    setTipo('pdf')
    setVisibilidad('todos')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Upload className="mr-2 size-4" />
            Subir Recurso
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Subir Nuevo Recurso</DialogTitle>
            <DialogDescription>
              Agrega un nuevo recurso a esta asignatura. Puedes controlar quien
              puede verlo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre del archivo</Label>
              <Input
                id="nombre"
                placeholder="Ej: Tema 1 - Introduccion.pdf"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo de archivo</Label>
              <Select
                value={tipo}
                onValueChange={(value) => setTipo(value as RecursoTipo)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPO_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {option.icon}
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="visibilidad">Visibilidad</Label>
              <Select
                value={visibilidad}
                onValueChange={(value) =>
                  setVisibilidad(value as UserRole | 'todos')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Quien puede ver este recurso" />
                </SelectTrigger>
                <SelectContent>
                  {VISIBILITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {option.value !== 'todos' && (
                          <Lock className="size-3 text-muted-foreground" />
                        )}
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Los recursos restringidos solo seran visibles para los roles
                seleccionados.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!nombre.trim()}>
              Subir Recurso
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
