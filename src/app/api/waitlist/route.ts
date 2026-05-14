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
        const resend = new Resend(process.env.RESEND_API_KEY);

        //Store email in Supabase
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

        // Send welcome email via Resend (insert already succeeded — verify domain & RESEND_API_KEY in prod)
        let emailError: { message: string } | null = null;
        try {
            const result = await resend.emails.send({
                from: 'Darwin <noreply@vesperworks.ca>',
                to: email,
                subject: "You're on the Darwin waitlist.",
                html: await render(WaitlistEmail()),
            });
            emailError = result.error ?? null;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Email delivery failed.';
            emailError = { message };
        }

        if (emailError) {
            return Response.json({ error: emailError.message }, { status: 500 });
        }

        return Response.json({ success: true }, { status: 200 });

    } catch (error) {
        return Response.json({ error: 'Something went wrong.' }, { status: 500 });
    }
}