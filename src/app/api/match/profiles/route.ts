import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return NextResponse.json({ message: "Token tidak ditemukan." }, { status: 401 });
  }

  const accessToken = authHeader.split(" ")[1]?.trim();
  if (!accessToken) {
    return NextResponse.json({ message: "Token tidak valid." }, { status: 401 });
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
  if (userError || !userData?.user) {
    return NextResponse.json(
      { message: "Sesi tidak valid atau sudah berakhir." },
      { status: 401 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, name, age, city, pekerjaan, interests, about, main_photo")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[GET /api/match/profiles]", error);
    return NextResponse.json(
      { message: "Gagal memuat data profil." },
      { status: 500 },
    );
  }

  const profiles =
    data
      ?.filter((row) => row.id !== userData.user.id)
      .map((row) => ({
        id: row.id,
        name: row.name,
        age: row.age,
        city: row.city,
        pekerjaan: row.pekerjaan,
        interests: Array.isArray(row.interests) ? row.interests : [],
        about: row.about,
        mainPhoto: row.main_photo,
      })) ?? [];

  return NextResponse.json({ profiles });
}
