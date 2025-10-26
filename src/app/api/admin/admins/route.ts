import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function assertSuperadmin(request: Request) {
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

  if (adminError || !adminRow || adminRow.role !== "superadmin") {
    return { error: NextResponse.json({ message: "Forbidden" }, { status: 403 }) };
  }

  return { userId: authData.user.id };
}

export async function GET(request: Request) {
  const verify = await assertSuperadmin(request);
  if ("error" in verify) {
    return verify.error;
  }

  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .select("id, email, role, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json(
      { message: "Gagal memuat admin.", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ admins: data ?? [] });
}

export async function POST(request: Request) {
  const verify = await assertSuperadmin(request);
  if ("error" in verify) {
    return verify.error;
  }

  const body = await request.json().catch(() => null);
  const email = body?.email as string | undefined;
  const password = body?.password as string | undefined;
  const role = body?.role as "superadmin" | "admin" | undefined;

  if (!email || !password || !role) {
    return NextResponse.json(
      { message: "Email, password, dan role wajib diisi." },
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
      user_metadata: { role },
    });

  if (createError || !createResult.user) {
    return NextResponse.json(
      {
        message: "Gagal membuat akun admin.",
        details: createError?.message ?? "Unknown error",
      },
      { status: 500 },
    );
  }

  const userId = createResult.user.id;

  const { error: insertError } = await supabaseAdmin
    .from("admin_users")
    .upsert({
      id: userId,
      email,
      role,
    });

  if (insertError) {
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return NextResponse.json(
      { message: "Gagal menyimpan data admin.", details: insertError.message },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      message: "Admin berhasil dibuat.",
      admin: { id: userId, email, role },
    },
    { status: 201 },
  );
}
