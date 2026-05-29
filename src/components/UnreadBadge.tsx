'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface UnreadBadgeProps {
  initialCount: number;
  userId: string;
}

export default function UnreadBadge({ initialCount, userId }: UnreadBadgeProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const supabase = createClient();

    const refetch = async () => {
      const { data } = await supabase.rpc('get_unread_count');
      if (typeof data === 'number') setCount(data);
    };

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
        refetch
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
        refetch
      )
      .subscribe();

    return () => {
      supabase.removeChannel(buyerChannel);
      supabase.removeChannel(sellerChannel);
    };
  }, [userId]);

  if (count <= 0) return null;

  return (
    <span className="nav-unread-badge" aria-label={`${count} unread messages`}>
      {count > 9 ? '9+' : count}
    </span>
  );
}
