'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { sendMessage, type MessageRow } from '@/app/messages/actions';

interface MessageInputProps {
  conversationId: string;
  currentUserId: string;
  onOptimisticSend: (msg: MessageRow) => void;
  onMessageSent: (tempId: string, real: MessageRow) => void;
  onSendError: (tempId: string, error: string) => void;
}

export default function MessageInput({
  conversationId,
  currentUserId,
  onOptimisticSend,
  onMessageSent,
  onSendError,
}: MessageInputProps) {
  const [value, setValue] = useState('');
  const [isPending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isPending) return;

    const tempId = `optimistic-${Date.now()}`;
    const optimistic: MessageRow = {
      id: tempId,
      conversation_id: conversationId,
      sender_id: currentUserId,
      body: trimmed,
      created_at: new Date().toISOString(),
    };

    setValue('');
    onOptimisticSend(optimistic);

    startTransition(async () => {
      const result = await sendMessage(conversationId, trimmed);
      if ('error' in result) {
        onSendError(tempId, result.error);
      } else {
        onMessageSent(tempId, result.message);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="msg-input-row">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message… (Enter to send)"
        rows={1}
        className="vspr-input"
        style={{
          resize: 'none',
          overflowY: 'hidden',
          minHeight: '3rem',
          flex: 1,
          lineHeight: '1.55',
        }}
        disabled={isPending}
      />
      <button
        onClick={handleSubmit}
        disabled={!value.trim() || isPending}
        className="pill-btn pill-btn-sm"
        style={{ flexShrink: 0, minWidth: '2.8rem' }}
        aria-label="Send message"
      >
        {isPending ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <ArrowRight size={14} />
        )}
      </button>
    </div>
  );
}
