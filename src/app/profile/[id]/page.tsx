import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PublicProfileClient from "./PublicProfileClient";
import { Listing } from "@/lib/data";

export default async function PublicProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch profile data
    const { data: profile } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, full_name, bio, avatar_url, school, level_of_study, program, interests, created_at")
        .eq("id", id)
        .maybeSingle();

    if (!profile) {
        notFound();
    }

    // Fetch user's listings
    const { data: listings } = await supabase
        .from("listings")
        .select("id, title, price, category, condition, campus, image_url, created_at")
        .eq("user_id", id)
        .order("created_at", { ascending: false });

    // Check if logged in user is viewing their own profile
    let currentUserId: string | null = null;
    try {
        const {
            data: { user: currentUser },
        } = await supabase.auth.getUser();
        currentUserId = currentUser?.id ?? null;
    } catch {
        // Logged out
    }

    const isOwnProfile = currentUserId === id;

    // Map listings to match Listing interface from lib/data
    const mappedListings: Listing[] = (listings ?? []).map((l: any) => {
        return {
            id: l.id,
            title: l.title,
            price: l.price,
            category: l.category ?? "Other",
            condition: l.condition ?? "New",
            description: "", // Public profile listings don't need descriptions loaded
            image: l.image_url ?? "/images/textbook.svg",
            seller: {
                id: profile.id,
                name: profile.full_name || profile.first_name || 'Student',
                avatar: profile.avatar_url || '/avatars/1.jpg',
                rating: 0,
                campus: l.campus ?? 'Main Campus',
            },
            createdAt: l.created_at,
            saved: false, // Default to false; saved state will be checked on individual cards or client-side if needed
        };
    });

    return (
        <PublicProfileClient
            profile={{
                id: profile.id,
                firstName: profile.first_name ?? "",
                lastName: profile.last_name ?? "",
                fullName: profile.full_name ?? "",
                bio: profile.bio ?? "",
                avatarUrl: profile.avatar_url ?? "",
                school: profile.school ?? "",
                levelOfStudy: profile.level_of_study ?? "",
                program: profile.program ?? "",
                interests: profile.interests ?? [],
                createdAt: profile.created_at || "",
            }}
            listings={mappedListings}
            isOwnProfile={isOwnProfile}
        />
    );
}
