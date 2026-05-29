import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getConversation, getConversationMessages } from '@/app/messages/actions';
import MessageThread from '@/components/MessageThread';
import PageTransition from '@/components/PageTransition';

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/login?next=/messages/${conversationId}`);

  const [conversation, initialMessages] = await Promise.all([
    getConversation(conversationId),
    getConversationMessages(conversationId),
  ]);

  if (!conversation) notFound();

  return (
    <PageTransition>
      <div className="container-vspr" style={{ paddingTop: '1.5rem', paddingBottom: 0 }}>
        <MessageThread
          conversationId={conversationId}
          currentUserId={user.id}
          initialMessages={initialMessages}
          conversation={conversation}
        />
      </div>
    </PageTransition>
  );
}
