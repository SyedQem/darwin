'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { MESSAGES_READ_EVENT, type MessagesReadDetail } from '@/lib/messages-events';

interface UnreadBadgeProps {
  initialCount: number;
  userId: string;
}

export default function UnreadBadge({ initialCount, userId }: UnreadBadgeProps) {
  const [count, setCount] = useState(initialCount);
  const pathname = usePathname();

  const refetch = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.rpc('get_unread_count');
    if (typeof data === 'number') setCount(data);
  }, []);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    const onRead = (event: Event) => {
      const cleared = (event as CustomEvent<MessagesReadDetail>).detail?.cleared;
      if (typeof cleared === 'number' && cleared > 0) {
        setCount((c) => Math.max(0, c - cleared));
      }
      void refetch();
    };
    window.addEventListener(MESSAGES_READ_EVENT, onRead);
    return () => window.removeEventListener(MESSAGES_READ_EVENT, onRead);
  }, [refetch]);

  useEffect(() => {
    if (pathname?.startsWith('/messages')) {
      void refetch();
    }
  }, [pathname, refetch]);

  useEffect(() => {
    const supabase = createClient();

    // Subscribe to conversation updates (buyer side and seller side separately,
    // because Supabase Realtime filter only supports single column equality)
    const buyerChannel = supabase
      .channel(`unread-buyer:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
          filter: `buyer_id=eq.${userId}`,
        },
        () => void refetch()
      )
      .subscribe();

    const sellerChannel = supabase
      .channel(`unread-seller:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
          filter: `seller_id=eq.${userId}`,
        },
        () => void refetch()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(buyerChannel);
      supabase.removeChannel(sellerChannel);
    };
  }, [userId, refetch]);

  if (count <= 0) return null;

  return (
    <span className="nav-unread-badge" aria-label={`${count} unread messages`}>
      {count > 9 ? '9+' : count}
    </span>
  );
}
