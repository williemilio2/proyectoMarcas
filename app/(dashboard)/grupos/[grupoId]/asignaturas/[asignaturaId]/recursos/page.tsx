'use client'

import { use, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Upload } from 'lucide-react'

import { useUser } from '@/contexts/user-context'
import { usePermissions } from '@/hooks/use-permissions'
import { RecursoList } from '@/components/recursos/recurso-list'
import { RecursoUploadDialog } from '@/components/recursos/recurso-upload-dialog'
import { Button } from '@/components/ui/button'

interface AsignaturaRecursosPageProps {
  params: Promise<{ grupoId: string; asignaturaId: string }>
}

export default function AsignaturaRecursosPage({
  params,
}: AsignaturaRecursosPageProps) {
  const { grupoId, asignaturaId } = use(params)
  const { grupos, setCurrentGrupo, getAsignaturasByGrupo, getRecursosByAsignatura } =
    useUser()
  const { canCreateRecurso } = usePermissions()

  const grupo = grupos.find((g) => g.id === grupoId)

  useEffect(() => {
    if (grupo) {
      setCurrentGrupo(grupo)
    }
    return () => setCurrentGrupo(null)
  }, [grupo, setCurrentGrupo])

  if (!grupo) {
    notFound()
  }

  const asignaturas = getAsignaturasByGrupo(grupoId)
  const asignatura = asignaturas.find((a) => a.id === asignaturaId)

  if (!asignatura) {
    notFound()
  }

  const recursos = getRecursosByAsignatura(asignaturaId)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/grupos/${grupoId}/asignaturas/${asignaturaId}`}>
              <ArrowLeft className="mr-2 size-4" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold">
              Recursos de {asignatura.nombre}
            </h1>
            <p className="text-sm text-muted-foreground">{grupo.nombre}</p>
          </div>
        </div>
        {canCreateRecurso() && (
          <RecursoUploadDialog asignaturaId={asignaturaId}>
            <Button>
              <Upload className="mr-2 size-4" />
              Subir Recurso
            </Button>
          </RecursoUploadDialog>
        )}
      </div>

      <RecursoList recursos={recursos} asignaturaId={asignaturaId} />
    </div>
  )
}
