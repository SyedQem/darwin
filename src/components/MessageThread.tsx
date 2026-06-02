'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { notifyMessagesRead } from '@/lib/messages-events';
import { markConversationRead, type MessageRow, type ConversationRow } from '@/app/messages/actions';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface MessageThreadProps {
  conversationId: string;
  currentUserId: string;
  initialMessages: MessageRow[];
  conversation: ConversationRow;
}

function isSameDay(a: string, b: string) {
  const da = new Date(a).toDateString();
  const db = new Date(b).toDateString();
  return da === db;
}

function formatDayLabel(isoString: string): string {
  const date = new Date(isoString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

export default function MessageThread({
  conversationId,
  currentUserId,
  initialMessages,
  conversation,
}: MessageThreadProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<MessageRow[]>(initialMessages);
  const messagesRef = useRef<HTMLDivElement>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  const clearUnread = useCallback(async () => {
    const cleared = conversation.unread;
    const { ok } = await markConversationRead(conversationId);
    if (ok) {
      notifyMessagesRead(cleared);
      router.refresh();
    }
  }, [conversationId, conversation.unread, router]);

  // Scroll the message panel (not the page) when messages change
  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Mark as read when opening the thread and when new messages arrive while viewing
  useEffect(() => {
    void clearUnread();
  }, [clearUnread, messages]);

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const incoming = payload.new as MessageRow;
          setMessages((prev) => {
            // Deduplicate against both real and optimistic messages
            if (prev.some((m) => m.id === incoming.id)) return prev;
            return [...prev, incoming];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const handleOptimisticSend = useCallback((msg: MessageRow) => {
    setSendError(null);
    setMessages((prev) => [...prev, msg]);
  }, []);

  const handleMessageSent = useCallback((tempId: string, real: MessageRow) => {
    setMessages((prev) => prev.map((m) => (m.id === tempId ? real : m)));
  }, []);

  const handleSendError = useCallback((tempId: string, error: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== tempId));
    setSendError(error);
    setTimeout(() => setSendError(null), 4000);
  }, []);

  const displayName =
    conversation.other_party.first_name ||
    conversation.other_party.full_name?.split(' ')[0] ||
    'Seller';

  return (
    <div className="messages-thread-layout">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem 0 1rem',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <Link
          href="/messages"
          className="flex items-center gap-1.5 text-muted hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={15} />
          <span>Inbox</span>
        </Link>

        <div className="flex-1 flex items-center gap-3 min-w-0">
          {/* Listing thumbnail */}
          <div
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '8px',
              overflow: 'hidden',
              flexShrink: 0,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-color)',
              position: 'relative',
            }}
          >
            {conversation.listing_image_url ? (
              <Image
                src={conversation.listing_image_url}
                alt={conversation.listing_title}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="min-w-0">
            <p
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {displayName}
            </p>
            <p
              style={{
                fontSize: '0.72rem',
                color: 'var(--accent)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {conversation.listing_title}
              {' · '}
              <span style={{ color: 'var(--text-muted)' }}>
                ${conversation.listing_price}
              </span>
            </p>
          </div>
        </div>

        <Link
          href={`/listing/${conversation.listing_id}`}
          className="pill-btn-sm pill-btn-outline hidden sm:inline-flex"
          style={{ flexShrink: 0 }}
        >
          View Listing
        </Link>
      </div>

      {/* Messages */}
      <div
        ref={messagesRef}
        className="flex min-h-0 flex-col gap-2 overflow-y-auto px-1 py-4"
        style={{ overflowAnchor: 'none' }}
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <p className="text-secondary text-sm">No messages yet.</p>
            <p className="text-muted text-xs">Say hello to start the conversation.</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const prev = messages[i - 1];
          const showSeparator = !prev || !isSameDay(prev.created_at, msg.created_at);
          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isMine={msg.sender_id === currentUserId}
              showDateSeparator={showSeparator}
              separatorLabel={showSeparator ? formatDayLabel(msg.created_at) : undefined}
            />
          );
        })}

        {sendError && (
          <p
            className="text-center text-xs py-2"
            style={{ color: '#fca5a5' }}
          >
            {sendError}
          </p>
        )}

      </div>

      {/* Input */}
      <MessageInput
        conversationId={conversationId}
        currentUserId={currentUserId}
        onOptimisticSend={handleOptimisticSend}
        onMessageSent={handleMessageSent}
        onSendError={handleSendError}
      />
    </div>
  );
}
