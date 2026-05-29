'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

import { PRESET_COLORS } from '@/lib/constants'
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
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { crearGrupo } from '@/src/actions/createGroup'
import { createRolInGroup } from '@/src/actions/createRolInGroup'

interface GrupoCreateDialogProps {
  children?: React.ReactNode
}

export function GrupoCreateDialog({ children }: GrupoCreateDialogProps) {
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim()) return

    const result = await crearGrupo(nombre, descripcion, selectedColor);
    if(result.success)
    {
        const response = await fetch(
          '/api/auth/me/',
          {
            method: 'GET',
            credentials: 'include',
          }
        )
        if(response.ok && result.grupoId)
        {
          const data = await response.json()
          await createRolInGroup(data.user.id, result.grupoId, "Creador");
        }
      setOpen(false)
    }else {
        alert(result.message);
      }
    
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="mr-2 size-4" />
            Nuevo Grupo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Grupo</DialogTitle>
            <DialogDescription>
              Crea un nuevo grupo para organizar tus asignaturas y estudiantes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre del grupo</Label>
              <Input
                id="nombre"
                placeholder="Ej: Matematicas 2024-A"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripcion (opcional)</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe el proposito de este grupo..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Color del grupo</Label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      'size-8 rounded-full transition-all',
                      selectedColor === color
                        ? 'ring-2 ring-offset-2 ring-primary'
                        : 'hover:scale-110'
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!nombre.trim()}>
              Crear Grupo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
