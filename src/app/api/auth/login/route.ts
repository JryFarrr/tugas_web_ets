import { NextResponse } from "next/server";
import { z } from "zod";

import { createSupabaseRouteClient } from "@/lib/supabaseRouteClient";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = loginSchema.safeParse(payload);

  const supabase = createSupabaseRouteClient();

  if (!parsed.success) {
    return NextResponse.json(
      {
        status: "error",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        {
          status: "error",
          message:
            error.message === "Invalid login credentials"
              ? "Kombinasi email dan password salah."
              : error.message ?? "Gagal login. Silakan coba lagi.",
        },
        { status: error.message === "Invalid login credentials" ? 401 : 400 },
      );
    }

    if (!data.user) {
      return NextResponse.json(
        {
          status: "error",
          message: "Tidak dapat menemukan akun dengan kredensial tersebut.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      status: "success",
      user: {
        id: data.user.id,
        email: data.user.email,
        name:
          (data.user.user_metadata?.full_name as string | undefined) ??
          (data.user.user_metadata?.name as string | undefined) ??
          data.user.email ??
          "Pengguna",
      },
      session: data.session ?? null,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        status: "error",
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}
