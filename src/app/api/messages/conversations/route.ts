import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createBrowserClient } from '@supabase/supabase-js';

function getSupabase(request: NextRequest) {
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

export async function GET(request: NextRequest) {
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
    .order('last_message_at', { ascending: false, nullsFirst: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ conversations: data });
}

export async function POST(request: NextRequest) {
  const supabase = await getSupabase(request);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body?.listing_id || !body?.seller_id) {
    return NextResponse.json({ error: 'listing_id and seller_id are required' }, { status: 400 });
  }

  if (user.id === body.seller_id) {
    return NextResponse.json({ error: 'Cannot message yourself' }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('listing_id', body.listing_id)
    .eq('buyer_id', user.id)
    .maybeSingle();

  if (existing) return NextResponse.json({ conversation_id: existing.id });

  const { data: created, error } = await supabase
    .from('conversations')
    .insert({ listing_id: body.listing_id, buyer_id: user.id, seller_id: body.seller_id })
    .select('id')
    .single();

  if (error || !created) {
    return NextResponse.json({ error: error?.message ?? 'Failed' }, { status: 500 });
  }
  return NextResponse.json({ conversation_id: created.id }, { status: 201 });
}
