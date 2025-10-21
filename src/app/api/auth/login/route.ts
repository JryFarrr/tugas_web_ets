import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = loginSchema.safeParse(payload);

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
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          status: "error",
          message: "Akun tidak ditemukan.",
        },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        {
          status: "error",
          message: "Kombinasi email dan password salah.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      status: "success",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
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
