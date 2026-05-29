'use client'

import { Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from "react";
import { GrupoList } from '@/components/grupos/grupo-list'
import { GrupoCreateDialog } from '@/components/grupos/grupo-create-dialog'
import { Button } from '@/components/ui/button'
import { obtenerGrupos } from "@/src/actions/showGroups";

export default function DashboardPage() {
  const [grupos, setGrupos] = useState<any[]>([]);

  useEffect(() => {
    cargarGrupos();
  }, []);

  async function cargarGrupos() {
    const data = await obtenerGrupos();
    setGrupos(data);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mis Grupos</h1>
          <p className="text-muted-foreground">
            Gestiona tus grupos y accede a tus asignaturas
          </p>
        </div> 
        <div className="flex gap-3">
          <GrupoCreateDialog>
            <Button>
              <Plus className="mr-2 size-4" />
              Crear Grupo
            </Button>
          </GrupoCreateDialog>
          <Button asChild>
            <Link href="/buscarGrupos">
              <Search className="mr-2 size-4" />
              Buscar Grupos
            </Link>
          </Button>
        </div>
      </div>

      <GrupoList grupos={grupos} />
    </div>
  )
}