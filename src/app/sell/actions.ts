"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createListing(formData: FormData): Promise<void> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const title = String(formData.get("title") || "");
    const description = String(formData.get("description") || "");
    const price = Number(formData.get("price") || 0);
    const category = String(formData.get("category") || "");
    const campus = String(formData.get("campus") || "");
    const image_url = formData.get("image_url")
        ? String(formData.get("image_url"))
        : null;

    const { error } = await supabase.from("listings").insert({
        user_id: user.id,
        title,
        description,
        price,
        category,
        campus,
        image_url,
    });

    if (error) {
        redirect("/sell?error=" + encodeURIComponent(error.message));
    }

    redirect("/sell?success=true");
}