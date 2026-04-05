import { createClient } from '@/lib/supabase/server';
import NavbarClient from './NavbarClient';

export default async function Navbar() {
    let isLoggedIn = false;

    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        isLoggedIn = !!user;
    } catch {
        isLoggedIn = false;
    }

    return <NavbarClient isLoggedIn={isLoggedIn} />;
}
