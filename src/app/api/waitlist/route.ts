import { createClient } from '@supabase/supabase-js';
import { render } from '@react-email/render';
import { Resend } from 'resend';
import WaitlistEmail from '@/components/WaitlistEmail';
import ReferralRewardEmail from '@/components/ReferralRewardEmail';

// Public site origin used to build shareable referral links.
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://darwinmarketplace.ca').replace(/\/$/, '');

// Referral codes are 8 chars from the generator's alphabet (no 0/O/1/I/L).
const REF_RE = /^[2-9A-HJ-NP-Z]{1,16}$/i;

type JoinResult = {
    code: string;
    existed: boolean;
    ref_count: number;
    just_unlocked: boolean;
    referrer_email: string | null;
};

function referralUrl(code: string) {
    return `${SITE_URL}/waitlist?ref=${code}`;
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as { email?: unknown; ref?: unknown };
        const email = typeof body.email === 'string' ? body.email.trim() : '';
        const ref =
            typeof body.ref === 'string' && REF_RE.test(body.ref.trim())
                ? body.ref.trim().toUpperCase()
                : null;

        if (!email) {
            return Response.json({ error: 'Email is required' }, { status: 400 });
        }

        // Instantiated per request — module-scope construction runs during
        // `next build` page-data collection, where these env vars are absent.
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Atomic insert + referral credit + reward unlock (join_waitlist RPC).
        // This is the source of truth for "registered" — it runs before any
        // email machinery so a Resend misconfiguration can never cost us the
        // signup.
        const { data, error: dbError } = await supabase
            .rpc('join_waitlist', { p_email: email, p_ref: ref })
            .single<JoinResult>();

        if (dbError || !data) {
            return Response.json(
                { error: dbError?.message ?? 'Something went wrong.' },
                { status: 500 },
            );
        }

        // Already on the list — surface their existing code/progress so the UI
        // can still show the share panel instead of a dead end.
        if (data.existed) {
            return Response.json(
                {
                    error: 'You are already on the waitlist.',
                    referralCode: data.code,
                    referralCount: data.ref_count,
                },
                { status: 409 },
            );
        }

        // Fire the referrer's reward email (best-effort). Constructing the
        // client and sending both live inside this try/catch so a missing
        // RESEND_API_KEY can never fail the new signup.
        if (data.just_unlocked && data.referrer_email) {
            try {
                const resend = new Resend(process.env.RESEND_API_KEY);
                await resend.emails.send({
                    from: 'Darwin <noreply@vesperworks.ca>',
                    to: data.referrer_email,
                    subject: 'You unlocked priority access to Darwin 🎉',
                    html: await render(ReferralRewardEmail()),
                });
            } catch (err) {
                console.error('[waitlist] reward email failed to send:', err);
            }
        }

        // Send welcome email (carries the new member's referral link). Same
        // hardening: construction + delivery inside the try/catch, log on
        // failure rather than turning an already-saved signup into an error.
        try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const result = await resend.emails.send({
                from: 'Darwin <noreply@vesperworks.ca>',
                to: email,
                subject: "You're on the Darwin waitlist.",
                html: await render(WaitlistEmail({ referralUrl: referralUrl(data.code) })),
            });
            if (result.error) {
                console.error('Waitlist welcome email failed to send:', result.error.message);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Email delivery failed.';
            console.error('Waitlist welcome email failed to send:', message);
        }

        return Response.json(
            { success: true, referralCode: data.code, referralCount: 0 },
            { status: 200 },
        );
    } catch {
        return Response.json({ error: 'Something went wrong.' }, { status: 500 });
    }
}
