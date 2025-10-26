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

export async function POST(request: Request) {
  const auth = await getAuthenticatedUserId(request);
  if ("error" in auth) {
    return auth.error;
  }

  const { userId } = auth;

  const body = await request.json().catch(() => null);
  const targetUserId = body?.targetUserId as string | undefined;

  if (!targetUserId) {
    return NextResponse.json(
      { message: "targetUserId wajib diisi." },
      { status: 400 },
    );
  }

  if (targetUserId === userId) {
    return NextResponse.json(
      { message: "Tidak dapat membuka percakapan dengan diri sendiri." },
      { status: 400 },
    );
  }

  const { data: userConversations, error: listError } = await supabaseAdmin
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", userId);

  if (listError) {
    return NextResponse.json(
      {
        message: "Gagal memeriksa percakapan pengguna.",
        details: listError.message,
      },
      { status: 500 },
    );
  }

  let conversationId: string | null = null;

  if (userConversations && userConversations.length) {
    const conversationIds = userConversations.map((row) => row.conversation_id);

    const { data: sharedConversation, error: sharedError } = await supabaseAdmin
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", targetUserId)
      .in("conversation_id", conversationIds)
      .limit(1)
      .maybeSingle();

    if (sharedError) {
      return NextResponse.json(
        {
          message: "Gagal memeriksa percakapan yang ada.",
          details: sharedError.message,
        },
        { status: 500 },
      );
    }

    if (sharedConversation) {
      conversationId = sharedConversation.conversation_id;
    }
  }

  if (!conversationId) {
    const { data: newConversation, error: insertConversationError } =
      await supabaseAdmin
        .from("conversations")
        .insert({})
        .select("id")
        .single();

    if (insertConversationError || !newConversation) {
      return NextResponse.json(
        {
          message: "Gagal membuat percakapan baru.",
          details: insertConversationError?.message ?? "Unknown error",
        },
        { status: 500 },
      );
    }

    conversationId = newConversation.id;

    const { error: participantsError } = await supabaseAdmin
      .from("conversation_participants")
      .insert([
        {
          conversation_id: conversationId,
          user_id: userId,
        },
        {
          conversation_id: conversationId,
          user_id: targetUserId,
        },
      ]);

    if (participantsError) {
      return NextResponse.json(
        {
          message: "Gagal menambahkan peserta percakapan.",
          details: participantsError.message,
        },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ conversationId });
}
