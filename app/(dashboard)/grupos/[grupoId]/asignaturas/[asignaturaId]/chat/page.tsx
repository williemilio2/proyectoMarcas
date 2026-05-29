'use client'

import { use, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { useUser } from '@/contexts/user-context'
import { ChatContainer } from '@/components/chat/chat-container'
import { Button } from '@/components/ui/button'

interface AsignaturaChatPageProps {
  params: Promise<{ grupoId: string; asignaturaId: string }>
}

export default function AsignaturaChatPage({ params }: AsignaturaChatPageProps) {
  const { grupoId, asignaturaId } = use(params)
  const { grupos, setCurrentGrupo, getAsignaturasByGrupo } = useUser()

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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/grupos/${grupoId}/asignaturas/${asignaturaId}`}>
            <ArrowLeft className="mr-2 size-4" />
            Volver a la asignatura
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Chat de {asignatura.nombre}</h1>
          <p className="text-sm text-muted-foreground">{grupo.nombre}</p>
        </div>
      </div>

      <ChatContainer contextType="asignatura" contextId={asignaturaId} />
    </div>
  )
}
