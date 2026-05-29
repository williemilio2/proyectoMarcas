'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

import { useUser } from '@/contexts/user-context'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ChatMessageList } from './chat-message-list'
import { cn } from '@/lib/utils'

interface ChatContainerProps {
  contextType: 'grupo' | 'asignatura'
  contextId: string
  compact?: boolean
  className?: string
}

export function ChatContainer({
  contextType,
  contextId,
  compact = false,
  className,
}: ChatContainerProps) {
  const { getMessagesByContext, addMessage, user } = useUser()
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const messages = getMessagesByContext(contextType, contextId)

  const handleSend = () => {
    if (!message.trim() || !user) return
    addMessage(contextType, contextId, message.trim())
    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className={cn(
        'flex flex-col rounded-lg border bg-card',
        compact ? 'h-[400px]' : 'h-[600px]',
        className
      )}
    >
      <div className="border-b px-4 py-3">
        <h3 className="font-semibold">
          Chat {contextType === 'grupo' ? 'General' : 'de Asignatura'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {messages.length} mensajes
        </p>
      </div>

      <ChatMessageList messages={messages} currentUserId={user?.id} />

      <div className="border-t p-3">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            className="min-h-[60px] resize-none"
            rows={2}
          />
          <Button
            onClick={handleSend}
            disabled={!message.trim()}
            size="icon"
            className="shrink-0"
          >
            <Send className="size-4" />
            <span className="sr-only">Enviar</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
