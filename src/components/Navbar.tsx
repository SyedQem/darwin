import { createClient } from '@/lib/supabase/server';
import NavbarClient from './NavbarClient';

export default async function Navbar() {
    let isLoggedIn = false;
    let userId: string | null = null;
    let initialUnreadCount = 0;
    let avatarUrl: string | null = null;
    let firstName: string | null = null;

    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        isLoggedIn = !!user;
        userId = user?.id ?? null;

        if (user) {
            const { data } = await supabase.rpc('get_unread_count');
            initialUnreadCount = (data as number) ?? 0;

            const { data: profile } = await supabase
                .from('profiles')
                .select('avatar_url, first_name')
                .eq('id', user.id)
                .maybeSingle();

            if (profile) {
                avatarUrl = profile.avatar_url ?? null;
                firstName = profile.first_name ?? null;
            }
        }
    } catch {
        isLoggedIn = false;
    }

    return (
        <NavbarClient
            isLoggedIn={isLoggedIn}
            userId={userId}
            initialUnreadCount={initialUnreadCount}
            avatarUrl={avatarUrl}
            firstName={firstName}
        />
    );
}
