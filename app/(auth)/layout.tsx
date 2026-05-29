import { GraduationCap } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <GraduationCap className="size-7" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold">Aulas</span>
          <span className="text-sm text-muted-foreground">
            Plataforma Educativa
          </span>
        </div>
      </div>
      {children}
    </div>
  )
}
