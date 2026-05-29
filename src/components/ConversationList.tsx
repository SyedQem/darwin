'use client';

import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import type { ConversationRow } from '@/app/messages/actions';
import ConversationListItem from './ConversationListItem';

interface ConversationListProps {
  conversations: ConversationRow[];
  activeId?: string;
}

export default function ConversationList({ conversations, activeId }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div
        className="empty-state mt-12 flex flex-col items-center gap-4 py-16 rounded-2xl"
        style={{ border: '1px dashed var(--border-color)' }}
      >
        <div className="empty-state-icon">
          <MessageCircle size={28} />
        </div>
        <div className="text-center">
          <p className="text-secondary text-lg font-medium">No messages yet</p>
          <p className="text-muted mt-1 text-sm">
            When you message a seller, it will show up here.
          </p>
        </div>
        <Link href="/browse" className="pill-btn mt-2 inline-flex">
          Browse Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 mt-8">
      {conversations.map((conv) => (
        <ConversationListItem
          key={conv.id}
          conversation={conv}
          isActive={conv.id === activeId}
        />
      ))}
    </div>
  );
}
