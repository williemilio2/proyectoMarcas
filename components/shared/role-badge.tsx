import { cn } from '@/lib/utils'
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/constants'
import type { UserRole } from '@/types'

interface RoleBadgeProps {
  role: UserRole
  className?: string
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        ROLE_COLORS[role],
        className
      )}
    >
      {ROLE_LABELS[role]}
    </span>
  )
}
