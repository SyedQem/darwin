"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(input: {
    firstName: string;
    lastName: string;
    bio: string;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    const firstName = input.firstName.trim();
    const lastName = input.lastName.trim();
    const bio = input.bio.trim();

    if (!firstName) {
        return { error: "First name is required" };
    }
    if (firstName.length > 50) {
        return { error: "First name is too long (max 50 characters)" };
    }
    if (lastName.length > 50) {
        return { error: "Last name is too long (max 50 characters)" };
    }
    if (bio.length > 300) {
        return { error: "Bio is too long (max 300 characters)" };
    }

    const fullName = [firstName, lastName].filter(Boolean).join(" ");

    const { error } = await supabase
        .from("profiles")
        .update({
            first_name: firstName,
            last_name: lastName || null,
            full_name: fullName,
            bio: bio || null,
        })
        .eq("id", user.id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/profile");
    revalidatePath("/", "layout");

    return { success: true };
}

export async function updateAvatarUrl(avatarUrl: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", user.id);

    if (error) {
        return { error: error.message };
     }
 
     revalidatePath("/profile");
     revalidatePath("/", "layout");
 
     return { success: true };
 }

function getSiteUrl() {
    return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
        /\/$/,
        "",
    );
}

export async function sendPasswordResetEmail() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
        return { error: "Not authenticated" };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${getSiteUrl()}/auth/callback?next=/profile`,
    });

    if (error) {
        return { error: error.message };
    }

    return {
        success: true,
        message: `Check your email (${user.email}) for a password reset link.`,
    };
}
