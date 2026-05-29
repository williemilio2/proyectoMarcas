'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { UserRole } from '@/types'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: number
  email: string
}
interface Grupo {
  id: string
  nombre: string
}
interface UserContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>

  grupos: Grupo[]
  currentGrupo: Grupo | null
  currentRole: UserRole | null
}

const UserContext =
  createContext<UserContextType | null>(null)

const PUBLIC_ROUTES = [
  '/login',
  '/registro',
]

export function UserProvider({
  children,
}: {
  children: ReactNode
}) {

  const router = useRouter()
  const pathname = usePathname()

  const [user, setUser] =
    useState<User | null>(null)

  const [isLoading, setIsLoading] =
    useState(true)
    const [grupos, setGrupos] = useState<Grupo[]>([])
    const [currentGrupo, setCurrentGrupo] =
      useState<Grupo | null>(null)

  const [currentRole, setCurrentRole] =
    useState<UserRole | null>(null)
  useEffect(() => {

    async function checkAuth() {

      try {

        const response = await fetch(
          '/api/auth/me/',
          {
            method: 'GET',
            credentials: 'include',
          }
        )

        if (response.ok) {
          console.log("Holaª");
          const data =
            await response.json()

          setUser(data.user)

        } else {

          setUser(null)

          if (
            !PUBLIC_ROUTES.includes(
              pathname
            )
          ) {
            router.push('/login')
          }
        }

      } catch {
          console.log("Holasª");

        setUser(null)

        if (
          !PUBLIC_ROUTES.includes(
            pathname
          )
        ) {
          router.push('/login')
        }

      } finally {

        setIsLoading(false)

      }
    }

    checkAuth()

  }, [pathname, router])

  async function logout() {

    await fetch('/api/auth/me/', {
      method: 'POST',
      credentials: 'include',
    })

    setUser(null)

    router.push('/login')
  }

  const isAuthenticated = !!user

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Cargando...
      </div>
    )
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        logout,

        grupos,
        currentGrupo,
        currentRole,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {

  const context =
    useContext(UserContext)

  if (!context) {
    throw new Error(
      'useUser must be used within UserProvider'
    )
  }

  return context
}