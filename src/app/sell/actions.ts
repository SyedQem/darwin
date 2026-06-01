"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface NewListingInput {
    title: string;
    price: number;
    imageUrls: string[];
    condition: string;
    category: string;
    description: string;
    campus: string;
}

export async function createListing(input: NewListingInput) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Ensure user profile exists (fallback for existing sessions/accounts)
    const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

    if (!profile) {
        const metadata = user.user_metadata || {};
        const email = user.email || "";
        const first_name = metadata.first_name || email.split("@")[0] || "User";
        const fullName = [metadata.first_name, metadata.last_name]
            .filter(Boolean)
            .join(" ") || first_name;

        const { error: insertErr } = await supabase.from("profiles").insert({
            id: user.id,
            username: email.split("@")[0] || `user_${user.id.substring(0, 8)}`,
            first_name,
            last_name: metadata.last_name || null,
            full_name: fullName,
            school: metadata.school || null,
            level_of_study: metadata.level_of_study || null,
            program: metadata.program || null,
            interests: metadata.interests || null,
        });

        if (insertErr) {
            return { error: `Profile creation failed: ${insertErr.message}` };
        }
    }

    const title = input.title.trim();
    const price = Number(input.price);

    if (!title) {
        return { error: "Title is required" };
    }
    if (!Number.isFinite(price) || price <= 0) {
        return { error: "Enter a price greater than $0" };
    }

    const imageUrls = input.imageUrls.filter(Boolean);

    const { error } = await supabase.from("listings").insert({
        user_id: user.id,
        title,
        description: input.description.trim() || null,
        price,
        category: input.category || null,
        condition: input.condition || null,
        campus: input.campus.trim() || null,
        image_url: imageUrls[0] ?? null,
        image_urls: imageUrls.length > 0 ? imageUrls : null,
    });

    if (error) {
        return { error: error.message };
    }

    redirect("/sell?success=true");
}
