import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Bypasses RLS.
 *
 * Use ONLY from server contexts that have no user cookie — e.g. webhook
 * route handlers invoking SECURITY DEFINER RPCs. For any request with a
 * logged-in user, use the cookie-bound client from ./server.ts instead.
 */
export function serviceClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false } },
    );
}
