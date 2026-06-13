"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

function validateListingInput(input: NewListingInput) {
    const title = input.title.trim();
    const price = Number(input.price);

    if (!title) {
        return { error: "Title is required" };
    }
    if (!Number.isFinite(price) || price <= 0) {
        return { error: "Enter a price greater than $0" };
    }

    return {
        title,
        price,
        imageUrls: input.imageUrls.filter(Boolean),
        description: input.description.trim() || null,
        category: input.category || null,
        condition: input.condition || null,
        campus: input.campus.trim() || null,
    };
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

    const validated = validateListingInput(input);
    if ("error" in validated) {
        return validated;
    }

    const { data: inserted, error } = await supabase
        .from("listings")
        .insert({
            user_id: user.id,
            title: validated.title,
            description: validated.description,
            price: validated.price,
            category: validated.category,
            condition: validated.condition,
            campus: validated.campus,
            image_url: validated.imageUrls[0] ?? null,
            image_urls: validated.imageUrls.length > 0 ? validated.imageUrls : null,
        })
        .select("id")
        .single();

    if (error) {
        return { error: error.message };
    }

    revalidatePath(`/listing/${inserted.id}`);
    revalidatePath("/browse");
    revalidatePath("/");
    revalidatePath("/profile");

    redirect(`/listing/${inserted.id}?published=true`);
}

export async function updateListing(listingId: string, input: NewListingInput) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: existing, error: fetchError } = await supabase
        .from("listings")
        .select("user_id")
        .eq("id", listingId)
        .maybeSingle();

    if (fetchError) {
        return { error: fetchError.message };
    }

    if (!existing || existing.user_id !== user.id) {
        return { error: "You can only edit your own listings" };
    }

    const validated = validateListingInput(input);
    if ("error" in validated) {
        return validated;
    }

    const { error } = await supabase
        .from("listings")
        .update({
            title: validated.title,
            description: validated.description,
            price: validated.price,
            category: validated.category,
            condition: validated.condition,
            campus: validated.campus,
            image_url: validated.imageUrls[0] ?? null,
            image_urls: validated.imageUrls.length > 0 ? validated.imageUrls : null,
        })
        .eq("id", listingId)
        .eq("user_id", user.id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath(`/listing/${listingId}`);
    revalidatePath("/browse");
    revalidatePath("/");
    revalidatePath("/profile");

    redirect(`/listing/${listingId}?updated=true`);
}
