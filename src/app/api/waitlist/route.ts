import { createClient } from '@supabase/supabase-js';
import { render } from '@react-email/render';
import { Resend } from 'resend';
import WaitlistEmail from '@/components/WaitlistEmail';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return Response.json({ error: 'Email is required' }, { status: 400 });
        }

        // Instantiated per request — module-scope construction runs during
        // `next build` page-data collection, where these env vars are absent.
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Store email in Supabase. This insert is the source of truth for
        // "registered" — it runs before any email machinery so a Resend
        // misconfiguration can never cost us the signup.
        const { error: dbError } = await supabase
            .from('waitlist')
            .insert({ email });

        if (dbError) {
            // Handle duplicate email gracefully
            if (dbError.code === '23505') {
                return Response.json({ error: 'You are already on the waitlist.' }, { status: 409 });
            }
            return Response.json({ error: dbError.message }, { status: 500 });
        }

        // Send welcome email via Resend. Constructing the client and sending
        // both live inside this try/catch: a missing RESEND_API_KEY (the
        // constructor throws) or a delivery failure must not turn an
        // already-saved user's request into an error.
        try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const result = await resend.emails.send({
                from: 'Darwin <noreply@vesperworks.ca>',
                to: email,
                subject: "You're on the Darwin waitlist.",
                html: await render(WaitlistEmail()),
            });
            if (result.error) {
                console.error('Waitlist welcome email failed to send:', result.error.message);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Email delivery failed.';
            console.error('Waitlist welcome email failed to send:', message);
        }

        return Response.json({ success: true }, { status: 200 });

    } catch (error) {
        return Response.json({ error: 'Something went wrong.' }, { status: 500 });
    }
}