'use client';

import { useRouter } from 'next/navigation';
import { useTransition, useState } from 'react';
import { MessageCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getOrCreateConversation } from '@/app/messages/actions';

interface MessageSellerButtonProps {
  listingId: string;
  sellerId: string;
  listingTitle: string;
  currentUserId?: string | null;
}

export default function MessageSellerButton({
  listingId,
  sellerId,
  listingTitle,
  currentUserId,
}: MessageSellerButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setError(null);

    // If we don't have a real sellerId yet (sample/mock data), bail gracefully
    if (!sellerId) {
      setError('Messaging not available for this listing yet.');
      return;
    }

    // Lazy auth check via browser client
    if (!currentUserId) {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/login?next=/listing/${listingId}`);
        return;
      }
    }

    startTransition(async () => {
      const result = await getOrCreateConversation(listingId, sellerId);
      if ('error' in result) {
        setError(result.error);
        return;
      }
      router.push(`/messages/${result.conversationId}`);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleClick}
        disabled={isPending}
        className="pill-btn ui-icon-label flex-1 min-h-12"
        aria-label={`Message seller about ${listingTitle}`}
      >
        {isPending ? (
          <Loader2 size={17} className="animate-spin" />
        ) : (
          <MessageCircle size={17} />
        )}
        <span>{isPending ? 'Opening…' : 'Message Seller'}</span>
      </button>
      {error && (
        <p className="text-center text-xs" style={{ color: '#fca5a5' }}>
          {error}
        </p>
      )}
    </div>
  );
}
