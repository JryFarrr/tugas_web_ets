"use server";

import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function getAuthenticatedUserId(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return {
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) {
    return {
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  return { userId: data.user.id };
}

export async function GET(request: Request) {
  const auth = await getAuthenticatedUserId(request);
  if ("error" in auth) {
    return auth.error;
  }

  const { userId } = auth;
  const { searchParams } = new URL(request.url);
  const partnerId = searchParams.get("partnerId");

  if (!partnerId) {
    return NextResponse.json(
      { message: "partnerId wajib diisi." },
      { status: 400 },
    );
  }

  const { data: myConversations, error: myConvError } = await supabaseAdmin
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", userId);

  if (myConvError) {
    return NextResponse.json(
      {
        message: "Gagal memverifikasi percakapan.",
        details: myConvError.message,
      },
      { status: 500 },
    );
  }

  const conversationIds = (myConversations ?? []).map(
    (row) => row.conversation_id,
  );

  if (!conversationIds.length) {
    return NextResponse.json(
      { message: "Tidak ada percakapan bersama pengguna ini." },
      { status: 403 },
    );
  }

  const { data: sharedConversation, error: sharedError } = await supabaseAdmin
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", partnerId)
    .in("conversation_id", conversationIds)
    .maybeSingle();

  if (sharedError) {
    return NextResponse.json(
      {
        message: "Gagal memverifikasi percakapan.",
        details: sharedError.message,
      },
      { status: 500 },
    );
  }

  if (!sharedConversation) {
    return NextResponse.json(
      { message: "Tidak memiliki percakapan bersama pengguna ini." },
      { status: 403 },
    );
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select(
      "id, name, age, city, pekerjaan, about, interests, gallery_a, gallery_b, main_photo",
    )
    .eq("id", partnerId)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json(
      {
        message: "Gagal memuat detail profil.",
        details: profileError.message,
      },
      { status: 500 },
    );
  }

  if (!profile) {
    return NextResponse.json(
      { message: "Profil tidak ditemukan." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    profile: {
      id: profile.id,
      name: profile.name,
      age: profile.age,
      city: profile.city,
      pekerjaan: profile.pekerjaan,
      about: profile.about,
      interests:
        Array.isArray(profile.interests) && profile.interests.length
          ? profile.interests
          : [],
      galleryA:
        Array.isArray(profile.gallery_a) && profile.gallery_a.length
          ? profile.gallery_a
          : [],
      galleryB:
        Array.isArray(profile.gallery_b) && profile.gallery_b.length
          ? profile.gallery_b
          : [],
      mainPhoto: profile.main_photo,
    },
  });
}

