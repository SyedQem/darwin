import WaitlistEmail from '@/components/WaitlistEmail';
import { render } from '@react-email/render';
import { Resend } from 'resend';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return Response.json({ error: 'Email is required' }, { status: 400 });
        }

        // Instantiated per request — module-scope construction runs during
        // `next build` page-data collection, where RESEND_API_KEY is absent.
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: 'Darwin <noreply@vesperworks.ca>',
            to: [email],
            subject: "You're on the Darwin waitlist.",
            html: await render(WaitlistEmail()),
        });

        if (error) {
            return Response.json({ error }, { status: 500 });
        }

        return Response.json(data);
    } catch (error) {
        return Response.json({ error: 'Something went wrong.' }, { status: 500 });
    }
}