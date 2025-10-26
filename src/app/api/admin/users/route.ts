import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function assertAdmin(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }

  const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !authData?.user) {
    return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }

  const { data: adminRow, error: adminError } = await supabaseAdmin
    .from("admin_users")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (adminError || !adminRow || !["superadmin", "admin"].includes(adminRow.role)) {
    return { error: NextResponse.json({ message: "Forbidden" }, { status: 403 }) };
  }

  return { userId: authData.user.id, role: adminRow.role };
}

export async function GET(request: Request) {
  const verify = await assertAdmin(request);
  if ("error" in verify) {
    return verify.error;
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select(
      "id, name, age, city, status, pekerjaan, about, interests, main_photo, gallery_a, gallery_b, updated_at, created_at",
    )
    .order("updated_at", { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json(
      { message: "Gagal memuat profil pengguna.", details: error.message },
      { status: 500 },
    );
  }

  const { data: users } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 500,
  });
  const emails = new Map(users?.users.map((user) => [user.id, user.email ?? null]));

  const merged =
    data?.map((profile) => ({
      id: profile.id,
      email: emails.get(profile.id) ?? null,
      name: profile.name,
      age: profile.age,
      city: profile.city,
      status: profile.status,
      pekerjaan: profile.pekerjaan,
      about: profile.about,
      interests: profile.interests,
      main_photo: profile.main_photo,
      gallery_a: profile.gallery_a,
      gallery_b: profile.gallery_b,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    })) ?? [];

  return NextResponse.json({ users: merged });
}

export async function POST(request: Request) {
  const verify = await assertAdmin(request);
  if ("error" in verify) {
    return verify.error;
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ message: "Payload tidak valid." }, { status: 400 });
  }

  const email = body.email as string | undefined;
  const password = body.password as string | undefined;
  const name = body.name as string | undefined;
  const city = body.city as string | undefined;
  const status = body.status as string | undefined;
  const pekerjaan = body.pekerjaan as string | undefined;
  const about = body.about as string | undefined;
  const interests = Array.isArray(body.interests) ? body.interests : [];

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email dan password wajib diisi." },
      { status: 400 },
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { message: "Password minimal 6 karakter." },
      { status: 400 },
    );
  }

  const { data: createResult, error: createError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: "member" },
    });

  if (createError || !createResult.user) {
    return NextResponse.json(
      {
        message: "Gagal membuat akun pengguna.",
        details: createError?.message ?? "Unknown error",
      },
      { status: 500 },
    );
  }

  const newUserId = createResult.user.id;

  const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
    id: newUserId,
    name: name ?? null,
    city: city ?? null,
    status: status ?? null,
    pekerjaan: pekerjaan ?? null,
    about: about ?? null,
    interests,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(newUserId);
    return NextResponse.json(
      { message: "Gagal menyimpan profil pengguna.", details: profileError.message },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      message: "Pengguna baru berhasil dibuat.",
      user: {
        id: newUserId,
        email,
        name: name ?? null,
        city: city ?? null,
        status: status ?? null,
        pekerjaan: pekerjaan ?? null,
        about: about ?? null,
        interests,
      },
    },
    { status: 201 },
  );
}
