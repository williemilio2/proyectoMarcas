'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, ChevronRight, Home } from 'lucide-react'

import { useUser } from '@/contexts/user-context'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { RoleBadge } from '@/components/shared/role-badge'

interface BreadcrumbSegment {
  label: string
  href?: string
}
interface Grupo {
  id: string
  nombre: string
}
function useBreadcrumbs(): BreadcrumbSegment[] {
  const pathname = usePathname()
  const { grupos, currentGrupo } = useUser()

  const segments: BreadcrumbSegment[] = []

  if (pathname === '/') {
    return [{ label: 'Inicio' }]
  }

  const parts = pathname.split('/').filter(Boolean)

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    const isLast = i === parts.length - 1
    const href = isLast ? undefined : '/' + parts.slice(0, i + 1).join('/')

    if (part === 'grupos') {
      segments.push({ label: 'Grupos', href: isLast ? undefined : '/' })
    } else if (parts[i - 1] === 'grupos') {
      const grupo = grupos.find((g) => g.id === part)
      segments.push({
        label: grupo?.nombre || 'Grupo',
        href,
      })
    } else if (part === 'asignaturas') {
      segments.push({ label: 'Asignaturas', href })
    } else if (parts[i - 1] === 'asignaturas') {
      segments.push({ label: 'Asignatura', href })
    } else if (part === 'chat') {
      segments.push({ label: 'Chat' })
    } else if (part === 'recursos') {
      segments.push({ label: 'Recursos' })
    } else if (part === 'perfil') {
      segments.push({ label: 'Mi Perfil' })
    } else if (part === 'configuracion') {
      segments.push({ label: 'Configuracion' })
    }
  }

  return segments
}

export function AppHeader() {
  const breadcrumbs = useBreadcrumbs()
  const { currentRole } = useUser()

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          {breadcrumbs.map((segment, index) => (
            <React.Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {segment.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={segment.href}>{segment.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-2">
        {currentRole && <RoleBadge role={currentRole} />}
        <Button variant="ghost" size="icon" className="size-8">
          <Bell className="size-4" />
          <span className="sr-only">Notificaciones</span>
        </Button>
      </div>
    </header>
  )
}
