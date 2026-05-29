import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import type { ChatMessage as ChatMessageType } from '@/types'
import { UserAvatar } from '@/components/shared/user-avatar'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
  message: ChatMessageType
  isOwn?: boolean
}

export function ChatMessage({ message, isOwn = false }: ChatMessageProps) {
  return (
    <div
      className={cn('flex gap-3', isOwn && 'flex-row-reverse')}
    >
      <UserAvatar user={message.user} size="sm" className="shrink-0 mt-1" />
      <div
        className={cn(
          'flex flex-col max-w-[75%]',
          isOwn && 'items-end'
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className={cn('text-sm font-medium', isOwn && 'order-2')}>
            {message.user?.nombre || 'Usuario'}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(message.createdAt), "d MMM, HH:mm", { locale: es })}
          </span>
        </div>
        <div
          className={cn(
            'rounded-lg px-3 py-2 text-sm',
            isOwn
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          )}
        >
          {message.contenido}
        </div>
      </div>
    </div>
  )
}
