'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  GraduationCap,
  Home,
  LogOut,
  Plus,
  Settings,
  User,
  Users,
} from 'lucide-react'
import { obtenerGruposDisponibles } from "@/src/actions/obtenerGruposEnLosQueEstoy";
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/user-context'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { GrupoCreateDialog } from '@/components/grupos/grupo-create-dialog'

function getInitials(name: string) {
  return name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
type Grupo = {
  id: number;
  nombre: string;
  color?: string | null;
};
export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout } = useUser() as any;
  const [gruposDisponibles, setGruposDisponibles] = useState<Grupo[]>([]);
  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;

      const data = await obtenerGruposDisponibles(user.id);
      setGruposDisponibles(JSON.parse(JSON.stringify(data)));
    };

    load();
  }, [user?.id]);
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <GraduationCap className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Aulas</span>
                  <span className="text-xs text-muted-foreground">
                    Plataforma Educativa
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {user && (
            <SidebarMenuItem>
              <SidebarMenuButton size="sm" asChild tooltip={user.nombre}>
                {/*
                <Link href="/perfil" className="flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  <span className="truncate text-sm">{user.email}</span>
                </Link>*/}
                <Link href="/" className="flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  <span className="truncate text-sm">{user.email}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/'}
                  tooltip="Inicio"
                >
                  <Link href="/">
                    <Home className="size-4" />
                    <span>Inicio</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Mis Grupos</SidebarGroupLabel>
          <GrupoCreateDialog>
            <SidebarGroupAction title="Crear grupo">
              <Plus className="size-4" />
              <span className="sr-only">Crear grupo</span>
            </SidebarGroupAction>
          </GrupoCreateDialog>
          <SidebarGroupContent>
            <SidebarMenu>
              {gruposDisponibles?.map((grupo: any) => {
                const isActive = pathname.startsWith(`/grupos/${grupo.id}`)
                  grupo.members?.find((m: any) => m.userId === user?.id)
                return (
                  <SidebarMenuItem key={grupo.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={grupo.nombre}
                    >
                      <Link href={`/grupos/${grupo.id}`}>
                        <div className="flex items-center gap-2">
                          
                          <div
                            className="size-3 rounded-full"
                            style={{ backgroundColor: grupo.color || "#3B82F6" }}
                          />

                          <span className="truncate">{grupo.nombre}</span>

                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
              {gruposDisponibles?.length === 0 && (
                <p className="px-2 py-4 text-sm text-muted-foreground">
                  No tienes grupos aun
                </p>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage src={user?.avatar} alt={user?.nombre} />
                    <AvatarFallback className="rounded-lg">
                      {user ? getInitials(user.nombre) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.nombre || 'Usuario'}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email || 'email@ejemplo.com'}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>{/*
                  <Link href="/perfil" href="/">
                    <Users className="mr-2 size-4" />
                    Mi Perfil
                  </Link>*/}
                  <Link href="/">
                    <Users className="mr-2 size-4" />
                    Mi Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/configuracion">
                    <Settings className="mr-2 size-4" />
                    Configuracion
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={logout}
                >
                  <LogOut className="mr-2 size-4" />
                  Cerrar Sesion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
