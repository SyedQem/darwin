import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createBrowserClient } from '@supabase/supabase-js';

async function getSupabase(request: NextRequest) {
  const auth = request.headers.get('Authorization');
  if (auth?.startsWith('Bearer ')) {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: auth } } }
    );
  }
  return createServerClient();
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await getSupabase(request);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: conv } = await supabase
    .from('conversations')
    .select('buyer_id, seller_id')
    .eq('id', id)
    .single();

  if (!conv) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const field = conv.buyer_id === user.id ? 'buyer_unread' : 'seller_unread';
  await supabase
    .from('conversations')
    .update({ [field]: 0 })
    .eq('id', id);

  return NextResponse.json({ ok: true });
}
