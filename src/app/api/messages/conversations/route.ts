"use server";

import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function getAuthenticatedUserId(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) {
    return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }

  return { userId: data.user.id };
}

function computeCompatibility(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return 70 + Math.abs(hash % 31);
}

export async function GET(request: Request) {
  const auth = await getAuthenticatedUserId(request);
  if ("error" in auth) {
    return auth.error;
  }

  const { userId } = auth;

  const { data: participantRows, error: participantError } = await supabaseAdmin
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", userId);

  if (participantError) {
    return NextResponse.json(
      {
        message: "Gagal memuat percakapan.",
        details: participantError.message,
      },
      { status: 500 },
    );
  }

  if (!participantRows || participantRows.length === 0) {
    return NextResponse.json({ conversations: [] });
  }

  const conversationIds = participantRows.map((row) => row.conversation_id);

  const { data: allParticipants, error: allParticipantsError } = await supabaseAdmin
    .from("conversation_participants")
    .select("conversation_id, user_id")
    .in("conversation_id", conversationIds);

  if (allParticipantsError || !allParticipants) {
    return NextResponse.json(
      {
        message: "Gagal memuat peserta percakapan.",
        details: allParticipantsError?.message ?? "Unknown error",
      },
      { status: 500 },
    );
  }

  const partnerIds = new Set<string>();
  const conversationPartners = new Map<string, string>();

  for (const row of allParticipants) {
    if (row.user_id !== userId) {
      conversationPartners.set(row.conversation_id, row.user_id);
      partnerIds.add(row.user_id);
    }
  }

  const partnerIdArray = Array.from(partnerIds);

  const { data: partnerProfiles, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("id, name, age, city, status, pekerjaan, about, main_photo")
    .in("id", partnerIdArray);

  if (profileError) {
    return NextResponse.json(
      {
        message: "Gagal memuat profil peserta percakapan.",
        details: profileError.message,
      },
      { status: 500 },
    );
  }

  const profileMap = new Map(
    partnerProfiles?.map((profile) => [
      profile.id,
      {
        id: profile.id,
        name: profile.name,
        age: profile.age,
        city: profile.city,
        status: profile.status,
        pekerjaan: profile.pekerjaan,
        about: profile.about,
        photoUrl: profile.main_photo,
      },
    ]) ?? [],
  );

  const { data: conversationsData, error: conversationError } = await supabaseAdmin
    .from("conversations")
    .select("id, created_at")
    .in("id", conversationIds);

  if (conversationError) {
    return NextResponse.json(
      {
        message: "Gagal memuat percakapan.",
        details: conversationError.message,
      },
      { status: 500 },
    );
  }

  const conversationsMap = new Map(
    conversationsData?.map((conversation) => [conversation.id, conversation]) ?? [],
  );

  const { data: messageRows, error: messagesError } = await supabaseAdmin
    .from("messages")
    .select("conversation_id, sender_id, content, created_at")
    .in("conversation_id", conversationIds)
    .order("created_at", { ascending: false });

  if (messagesError) {
    return NextResponse.json(
      {
        message: "Gagal memuat pesan terakhir.",
        details: messagesError.message,
      },
      { status: 500 },
    );
  }

  const lastMessageMap = new Map<string, { senderId: string; content: string; createdAt: string }>();

  if (messageRows) {
    for (const row of messageRows) {
      if (!lastMessageMap.has(row.conversation_id)) {
        lastMessageMap.set(row.conversation_id, {
          senderId: row.sender_id,
          content: row.content,
          createdAt: row.created_at,
        });
      }
    }
  }

  const conversations = conversationIds.map((conversationId) => {
    const partnerId = conversationPartners.get(conversationId);
    const partner = partnerId ? profileMap.get(partnerId) : null;
    const conversationRow = conversationsMap.get(conversationId);
    const lastMessage = lastMessageMap.get(conversationId) ?? null;

    const compatibilitySeed = partnerId
      ? `${userId}-${partnerId}`
      : `${userId}-${conversationId}`;

    return {
      id: conversationId,
      partner: partner ?? {
        id: partnerId ?? "unknown",
        name: "Pengguna SoulMatch",
        age: null,
        city: null,
        status: null,
        pekerjaan: null,
        about: null,
        photoUrl: null,
      },
      compatibility: computeCompatibility(compatibilitySeed),
      stage: "pdkt",
      createdAt: conversationRow?.created_at ?? null,
      lastMessage,
    };
  });

  return NextResponse.json({ conversations });
}
