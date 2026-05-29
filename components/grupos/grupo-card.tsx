import Link from 'next/link'
import { BookOpen, Users } from 'lucide-react'

import {useState, useEffect} from 'react';
import type { Grupo, UserRole } from '@/types'
import { obtenerRol } from '@/src/actions/getRol'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface GrupoCardProps {
  grupo: Grupo
  usuarioId: number
  asignaturasCount?: number
}
const roles: Record<UserRole, String> = {
  1: "Profesor",
  2: "Administrador",
  3: "Alumno",
  4: "Delegado",
  5: "Creador",
}


export function GrupoCard({ grupo, usuarioId, asignaturasCount = 0 }: GrupoCardProps) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
    useEffect(() => {
      cargarRol();
    }, []);
    async function cargarRol() {
      const rol = await obtenerRol(grupo.id, usuarioId)
      setUserRole(rol as UserRole | null);
    }
  if (userRole === null) {
      return null;
    }
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md">
      <div
        className="h-2 w-full"
        style={{ backgroundColor: grupo.color || '#3B82F6' }}
      />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: grupo.color || '#3B82F6' }}
            >
              <BookOpen className="size-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold leading-none">{grupo.nombre}</h3>
              {grupo.descripcion && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                  {grupo.descripcion}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        {/*
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="size-4" />
            <span>{asignaturasCount} asignaturas</span>
          </div>
          {grupo.members && (
            <div className="flex items-center gap-1">
              <Users className="size-4" />
              <span>{grupo.members.length} miembros</span>
            </div>
          )}
        </div>
        */}
        
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t bg-muted/50 pt-3">
        {userRole !== null ? roles[userRole] : "Sin rol"}
        <Button asChild variant="ghost" size="sm" className="ml-auto">
          <Link href={`/grupos/${grupo.id}`}>Ver grupo</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
