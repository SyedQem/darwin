import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?next=/profile");
    }

    // Fetch profile data
    const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name, full_name, bio, avatar_url, school")
        .eq("id", user.id)
        .maybeSingle();

    // Fetch user's listings
    const { data: listings } = await supabase
        .from("listings")
        .select("id, title, price, category, condition, campus, image_url, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <ProfileClient
            user={{
                id: user.id,
                email: user.email ?? "",
                createdAt: user.created_at,
            }}
            profile={{
                firstName: profile?.first_name ?? "",
                lastName: profile?.last_name ?? "",
                fullName: profile?.full_name ?? "",
                bio: profile?.bio ?? "",
                avatarUrl: profile?.avatar_url ?? "",
                school: profile?.school ?? "",
            }}
            listings={(listings ?? []).map((l: any) => ({
                id: l.id,
                title: l.title,
                price: l.price,
                category: l.category ?? "Other",
                condition: l.condition ?? "New",
                campus: l.campus ?? "",
                imageUrl: l.image_url ?? "/images/textbook.svg",
                createdAt: l.created_at,
            }))}
        />
    );
}
