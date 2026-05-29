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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await getSupabase(request);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('conversations')
    .select(
      `id, listing_id, buyer_id, seller_id, last_message, last_message_at, buyer_unread, seller_unread,
       listing:listings!listing_id(id, title, image_url, price),
       buyer:profiles!buyer_id(id, first_name, full_name),
       seller:profiles!seller_id(id, first_name, full_name)`
    )
    .eq('id', id)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ conversation: data });
}
