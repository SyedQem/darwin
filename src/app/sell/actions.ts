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

    const { error } = await supabase.from("listings").insert({
        user_id: user.id,
        title,
        description,
        price,
        category,
        campus,
    });

    if (error) {
        throw new Error(error.message);
    }

    redirect("/browse");
}