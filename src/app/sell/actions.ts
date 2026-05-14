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
