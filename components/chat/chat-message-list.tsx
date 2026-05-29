'use client'

import { useEffect, useRef } from 'react'
import { ChatMessage } from './chat-message'
import type { ChatMessage as ChatMessageType } from '@/types'
import { cn } from '@/lib/utils'

interface ChatMessageListProps {
  messages: ChatMessageType[]
  currentUserId?: string
  className?: string
}

export function ChatMessageList({
  messages,
  currentUserId,
  className,
}: ChatMessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  if (messages.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-1 items-center justify-center text-muted-foreground',
          className
        )}
      >
        <p className="text-sm">No hay mensajes aun. Se el primero en escribir!</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn('flex-1 overflow-y-auto p-4 space-y-4', className)}
    >
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          isOwn={message.userId === currentUserId}
        />
      ))}
    </div>
  )
}
