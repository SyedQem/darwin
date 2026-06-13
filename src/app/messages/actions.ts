"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type MessageRow = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export type ConversationParticipant = {
  id: string;
  first_name: string | null;
  full_name: string | null;
};

export type ConversationRow = {
  id: string;
  listing_id: string;
  listing_title: string;
  listing_image_url: string | null;
  listing_price: number;
  buyer_id: string;
  seller_id: string;
  last_message: string | null;
  last_message_at: string | null;
  unread: number;
  other_party: ConversationParticipant;
};

export async function getOrCreateConversation(
  listingId: string,
  sellerId: string
): Promise<{ conversationId: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (user.id === sellerId) {
    return { error: "Cannot message yourself" };
  }

  // Check for existing conversation
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("listing_id", listingId)
    .eq("buyer_id", user.id)
    .maybeSingle();

  if (existing) return { conversationId: existing.id };

  // Create new
  const { data: created, error } = await supabase
    .from("conversations")
    .insert({ listing_id: listingId, buyer_id: user.id, seller_id: sellerId })
    .select("id")
    .single();

  if (error || !created) {
    return { error: error?.message ?? "Failed to start conversation" };
  }
  return { conversationId: created.id };
}

export async function sendMessage(
  conversationId: string,
  body: string
): Promise<{ message: MessageRow } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const trimmed = body.trim();
  if (!trimmed) return { error: "Message cannot be empty" };
  if (trimmed.length > 2000) return { error: "Message is too long" };

  const { data, error } = await supabase
    .from("messages")
    .insert({ conversation_id: conversationId, sender_id: user.id, body: trimmed })
    .select()
    .single();

  if (error || !data) return { error: error?.message ?? "Failed to send" };
  return { message: data as MessageRow };
}

export async function markConversationRead(
  conversationId: string
): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { data: conv } = await supabase
    .from("conversations")
    .select("buyer_id, seller_id")
    .eq("id", conversationId)
    .single();

  if (!conv) {
    console.error("markConversationRead: Conversation not found or read blocked by RLS:", conversationId);
    return { ok: false };
  }

  const field = conv.buyer_id === user.id ? "buyer_unread" : "seller_unread";
  const { error } = await supabase
    .from("conversations")
    .update({ [field]: 0 })
    .eq("id", conversationId);

  if (error) {
    console.error("markConversationRead: Update error:", error);
    return { ok: false };
  }

  revalidatePath("/messages");
  revalidatePath(`/messages/${conversationId}`);
  return { ok: true };
}

export async function getConversations(): Promise<ConversationRow[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("conversations")
    .select(
      `id, listing_id, buyer_id, seller_id, last_message, last_message_at, buyer_unread, seller_unread,
       listing:listings!listing_id(id, title, image_url, price),
       buyer:profiles!buyer_id(id, first_name, full_name),
       seller:profiles!seller_id(id, first_name, full_name)`
    )
    .order("last_message_at", { ascending: false, nullsFirst: false });

  if (error || !data) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any[]).map((c) => {
    const isBuyer = c.buyer_id === user.id;
    const otherParty = isBuyer ? c.seller : c.buyer;
    return {
      id: c.id,
      listing_id: c.listing_id,
      listing_title: c.listing?.title ?? "Deleted listing",
      listing_image_url: c.listing?.image_url ?? null,
      listing_price: c.listing?.price ?? 0,
      buyer_id: c.buyer_id,
      seller_id: c.seller_id,
      last_message: c.last_message,
      last_message_at: c.last_message_at,
      unread: isBuyer ? c.buyer_unread : c.seller_unread,
      other_party: {
        id: otherParty?.id ?? "",
        first_name: otherParty?.first_name ?? null,
        full_name: otherParty?.full_name ?? null,
      },
    };
  });
}

export async function getConversationMessages(conversationId: string): Promise<MessageRow[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(50);

  if (error || !data) return [];
  return data as MessageRow[];
}

export async function getConversation(conversationId: string): Promise<ConversationRow | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("conversations")
    .select(
      `id, listing_id, buyer_id, seller_id, last_message, last_message_at, buyer_unread, seller_unread,
       listing:listings!listing_id(id, title, image_url, price),
       buyer:profiles!buyer_id(id, first_name, full_name),
       seller:profiles!seller_id(id, first_name, full_name)`
    )
    .eq("id", conversationId)
    .single();

  if (error || !data) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = data as any;
  const isBuyer = c.buyer_id === user.id;
  const otherParty = isBuyer ? c.seller : c.buyer;

  return {
    id: c.id,
    listing_id: c.listing_id,
    listing_title: c.listing?.title ?? "Deleted listing",
    listing_image_url: c.listing?.image_url ?? null,
    listing_price: c.listing?.price ?? 0,
    buyer_id: c.buyer_id,
    seller_id: c.seller_id,
    last_message: c.last_message,
    last_message_at: c.last_message_at,
    unread: isBuyer ? c.buyer_unread : c.seller_unread,
    other_party: {
      id: otherParty?.id ?? "",
      first_name: otherParty?.first_name ?? null,
      full_name: otherParty?.full_name ?? null,
    },
  };
}
