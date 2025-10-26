import { NextResponse } from "next/server";
import { z } from "zod";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createSupabaseRouteClient } from "@/lib/supabaseRouteClient";

const registerSchema = z
  .object({
    email: z.string().email("Email tidak valid"),
    name: z.string().min(2, "Nama minimal 2 karakter"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(
        /^(?=.*[A-Z])(?=.*\d).+$/,
        "Password harus mengandung huruf kapital dan angka"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak sesuai",
    path: ["confirmPassword"],
  });

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = registerSchema.safeParse(payload);

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

  const { email, name, password } = parsed.data;

  try {
    const { data: existingUsers, error: listError } =
      await supabaseAdmin.auth.admin.listUsers({
        email,
        perPage: 1,
      });

    if (listError) {
      console.warn("[register] Gagal memeriksa user existing:", listError);
    }

    if (existingUsers?.users?.length) {
      return NextResponse.json(
        {
          status: "error",
          message: "Email sudah terdaftar. Silakan login.",
        },
        { status: 409 }
      );
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/login`,
      },
    });

    if (error) {
      const status = error.message === "User already registered" ? 409 : 400;
      return NextResponse.json(
        {
          status: "error",
          message:
            status === 409
              ? "Email sudah terdaftar. Silakan login."
              : error.message ?? "Gagal mendaftarkan akun.",
        },
        { status },
      );
    }

    if (data.user) {
      try {
        await supabaseAdmin
          .from("profiles")
          .upsert(
            {
              id: data.user.id,
              name,
              email,
            },
            { onConflict: "id" },
          );
      } catch (profileError) {
        console.warn("[register] Gagal membuat profil default:", profileError);
      }
    }

    return NextResponse.json(
      {
        status: "success",
        user: data.user
          ? {
              id: data.user.id,
              email: data.user.email,
              name,
              emailConfirmedAt: data.user.email_confirmed_at,
            }
          : null,
        message: data.session
          ? "Pendaftaran berhasil."
          : "Pendaftaran berhasil. Silakan cek email untuk verifikasi sebelum login.",
      },
      { status: 201 },
    );
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
