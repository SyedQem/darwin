import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getConversations } from './actions';
import ConversationList from '@/components/ConversationList';
import PageTransition from '@/components/PageTransition';

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?next=/messages');

  const conversations = await getConversations();

  return (
    <PageTransition>
      <div className="container-vspr page-shell">
        <div className="page-hero">
          <span className="section-label">Inbox</span>
          <h1 className="section-title-md max-w-3xl">Your messages.</h1>
          <p className="page-hero-copy max-w-2xl">
            Conversations about listings you're buying or selling.
          </p>
        </div>

        <ConversationList conversations={conversations} />
      </div>
    </PageTransition>
  );
}
