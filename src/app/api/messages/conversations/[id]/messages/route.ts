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

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 100);
  const before = searchParams.get('before');

  let query = supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (before) query = query.lt('created_at', before);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ messages: (data ?? []).reverse() });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await getSupabase(request);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body?.body?.trim()) {
    return NextResponse.json({ error: 'body is required' }, { status: 400 });
  }

  const trimmed = (body.body as string).trim();
  if (trimmed.length > 2000) {
    return NextResponse.json({ error: 'Message too long' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: id, sender_id: user.id, body: trimmed })
    .select()
    .single();

  if (error || !data) return NextResponse.json({ error: error?.message ?? 'Failed' }, { status: 500 });
  return NextResponse.json({ message: data }, { status: 201 });
}
