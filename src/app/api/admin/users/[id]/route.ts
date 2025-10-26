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

type RouteContext<P> = { params: Promise<P> };

export async function PATCH(
  request: Request,
  context: RouteContext<{ id: string }>,
) {
  const verify = await assertAdmin(request);
  if ("error" in verify) {
    return verify.error;
  }

  const { id } = await context.params;

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ message: "Payload tidak valid." }, { status: 400 });
  }

  const payload: Record<string, unknown> = {};
  if ("name" in body) payload.name = body.name ?? null;
  if ("city" in body) payload.city = body.city ?? null;
  if ("status" in body) payload.status = body.status ?? null;
  if ("pekerjaan" in body) payload.pekerjaan = body.pekerjaan ?? null;
  if ("about" in body) payload.about = body.about ?? null;
  if ("interests" in body) {
    if (Array.isArray(body.interests)) {
      payload.interests = body.interests;
    } else {
      return NextResponse.json(
        { message: "Format interests tidak valid. Gunakan array string." },
        { status: 400 },
      );
    }
  }
  if ("main_photo" in body) {
    payload.main_photo = body.main_photo ?? null;
  }
  if ("gallery_a" in body) {
    if (Array.isArray(body.gallery_a)) {
      payload.gallery_a = body.gallery_a;
    } else {
      return NextResponse.json(
        { message: "Format gallery_a tidak valid. Gunakan array string." },
        { status: 400 },
      );
    }
  }
  if ("gallery_b" in body) {
    if (Array.isArray(body.gallery_b)) {
      payload.gallery_b = body.gallery_b;
    } else {
      return NextResponse.json(
        { message: "Format gallery_b tidak valid. Gunakan array string." },
        { status: 400 },
      );
    }
  }
  if ("age" in body) {
    if (body.age === null || body.age === undefined || body.age === "") {
      payload.age = null;
    } else if (Number.isInteger(body.age)) {
      payload.age = body.age;
    } else {
      return NextResponse.json(
        { message: "Usia harus berupa angka bulat." },
        { status: 400 },
      );
    }
  }

  if (!Object.keys(payload).length) {
    return NextResponse.json(
      { message: "Tidak ada perubahan yang dikirim." },
      { status: 400 },
    );
  }

  payload.updated_at = new Date().toISOString();

  const { error } = await supabaseAdmin
    .from("profiles")
    .update(payload)
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { message: "Gagal memperbarui profil pengguna.", details: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "Profil berhasil diperbarui." });
}
