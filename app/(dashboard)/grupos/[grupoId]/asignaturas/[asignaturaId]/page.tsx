'use client'

import { use, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Plus, MessageCircle, Upload } from 'lucide-react'

import { useUser } from '@/contexts/user-context'
import { usePermissions } from '@/hooks/use-permissions'
import { AsignaturaHeader } from '@/components/asignaturas/asignatura-header'
import { RecursoList } from '@/components/recursos/recurso-list'
import { RecursoUploadDialog } from '@/components/recursos/recurso-upload-dialog'
import { ChatContainer } from '@/components/chat/chat-container'
import { Button } from '@/components/ui/button'

interface AsignaturaPageProps {
  params: Promise<{ grupoId: string; asignaturaId: string }>
}

export default function AsignaturaPage({ params }: AsignaturaPageProps) {
  const { grupoId, asignaturaId } = use(params)
  const {
    grupos,
    user,
    setCurrentGrupo,
    getAsignaturasByGrupo,
    getRecursosByAsignatura,
  } = useUser()
  const { canCreateRecurso, canEditAsignatura } = usePermissions()

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
    <div className="space-y-6">
      <AsignaturaHeader
        asignatura={asignatura}
        grupo={grupo}
        showManage={canEditAsignatura()}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recursos Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recursos</h2>
            {canCreateRecurso() && (
              <RecursoUploadDialog asignaturaId={asignaturaId}>
                <Button size="sm">
                  <Upload className="mr-2 size-4" />
                  Subir Recurso
                </Button>
              </RecursoUploadDialog>
            )}
          </div>
          <RecursoList recursos={recursos} asignaturaId={asignaturaId} />
        </div>

        {/* Chat Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Chat de Asignatura</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link
                href={`/grupos/${grupoId}/asignaturas/${asignaturaId}/chat`}
              >
                <MessageCircle className="mr-2 size-4" />
                Ver completo
              </Link>
            </Button>
          </div>
          <ChatContainer
            contextType="asignatura"
            contextId={asignaturaId}
            compact
          />
        </div>
      </div>
    </div>
  )
}
