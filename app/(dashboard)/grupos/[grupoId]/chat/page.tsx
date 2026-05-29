'use client'

import { use, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { useUser } from '@/contexts/user-context'
import { ChatContainer } from '@/components/chat/chat-container'
import { Button } from '@/components/ui/button'

interface GrupoChatPageProps {
  params: Promise<{ grupoId: string }>
}

export default function GrupoChatPage({ params }: GrupoChatPageProps) {
  const { grupoId } = use(params)
  const { grupos, user, setCurrentGrupo } = useUser()

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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/grupos/${grupoId}`}>
            <ArrowLeft className="mr-2 size-4" />
            Volver al grupo
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Chat General</h1>
          <p className="text-sm text-muted-foreground">{grupo.nombre}</p>
        </div>
      </div>

      <ChatContainer contextType="grupo" contextId={grupoId} />
    </div>
  )
}
