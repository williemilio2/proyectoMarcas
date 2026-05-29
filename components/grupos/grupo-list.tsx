'use client'

import { BookOpen, Plus } from 'lucide-react'

import type { Grupo } from '@/types'
import {useState, useEffect } from 'react';
import { GrupoCard } from './grupo-card'
import { GrupoCreateDialog } from './grupo-create-dialog'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'

interface GrupoListProps {
  grupos: Grupo[]
}

export function GrupoList({ grupos }: GrupoListProps) {
  const [usuario, setUsuario] = useState(Number);

    useEffect(() => {
      cargarUser();
    }, []);
    async function cargarUser() {
      const response = await fetch(
        '/api/auth/me/',
        {
          method: 'GET',
          credentials: 'include',
        }
      )
      if (!response.ok) {
        console.error('No autenticado')
        return
      }

      const data = await response.json()
      setUsuario(data.user.id);
    }
  if (grupos?.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen className="size-6 text-muted-foreground" />}
        title="No tienes grupos"
        description="Crea tu primer grupo para comenzar a organizar tus clases y recursos educativos."
        action={
          <GrupoCreateDialog>
            <Button>
              <Plus className="mr-2 size-4" />
              Crear primer grupo
            </Button>
          </GrupoCreateDialog>
        }
      />
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {grupos?.map((grupo) => {
        return (
          <GrupoCard
            key={grupo.id}
            grupo={grupo}
            usuarioId={usuario}
          />
        )
      })}
    </div>
  )
}
