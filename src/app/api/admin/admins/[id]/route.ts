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

  return { requesterId: authData.user.id };
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const verify = await assertSuperadmin(request);
  if ("error" in verify) {
    return verify.error;
  }

  const body = await request.json().catch(() => null);
  const role = body?.role as "superadmin" | "admin" | undefined;
  if (!role) {
    return NextResponse.json(
      { message: "Peran baru wajib diisi." },
      { status: 400 },
    );
  }

  const { error: updateError } = await supabaseAdmin
    .from("admin_users")
    .update({ role })
    .eq("id", params.id);

  if (updateError) {
    return NextResponse.json(
      { message: "Gagal memperbarui peran admin.", details: updateError.message },
      { status: 500 },
    );
  }

  await supabaseAdmin.auth.admin.updateUserById(params.id, {
    user_metadata: { role },
  });

  return NextResponse.json({ message: "Peran admin diperbarui." });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const verify = await assertSuperadmin(request);
  if ("error" in verify) {
    return verify.error;
  }

  const adminId = params.id;

  const { error: deleteRowError } = await supabaseAdmin
    .from("admin_users")
    .delete()
    .eq("id", adminId);

  if (deleteRowError) {
    return NextResponse.json(
      { message: "Gagal menghapus data admin.", details: deleteRowError.message },
      { status: 500 },
    );
  }

  await supabaseAdmin.auth.admin.deleteUser(adminId);

  return NextResponse.json({ message: "Admin berhasil dihapus." });
}
