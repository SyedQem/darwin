import { createClient } from '@supabase/supabase-js';

const REF_RE = /^[2-9A-HJ-NP-Z]{1,16}$/i;

// Live referral progress for a given code — used by the waitlist page to
// restore the share panel on return visits (code persisted in localStorage).
export async function GET(request: Request) {
    const code = new URL(request.url).searchParams.get('code')?.trim().toUpperCase();

    if (!code || !REF_RE.test(code)) {
        return Response.json({ error: 'Invalid code' }, { status: 400 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
        .from('waitlist')
        .select('referral_count, priority_access')
        .eq('referral_code', code)
        .maybeSingle();

    if (error) {
        return Response.json({ error: 'Lookup failed' }, { status: 500 });
    }
    if (!data) {
        return Response.json({ error: 'Not found' }, { status: 404 });
    }

    return Response.json({
        referralCount: data.referral_count,
        rewardUnlocked: data.priority_access,
    });
}
