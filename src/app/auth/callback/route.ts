import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNext(raw: string | null): string {
    if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
        return "/profile";
    }
    return raw;
}

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = safeNext(searchParams.get("next"));

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent("Authentication link expired or invalid. Please try again.")}`,
    );
}
