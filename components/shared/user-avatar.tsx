import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { User } from '@/types'

interface UserAvatarProps {
  user: User | null | undefined
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const sizeClasses = {
  sm: 'size-6 text-xs',
  md: 'size-8 text-sm',
  lg: 'size-10 text-base',
}

export function UserAvatar({ user, className, size = 'md' }: UserAvatarProps) {
  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src={user?.avatar} alt={user?.nombre} />
      <AvatarFallback>{user ? getInitials(user.nombre) : 'U'}</AvatarFallback>
    </Avatar>
  )
}
