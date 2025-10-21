import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

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
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        {
          status: "error",
          message: "Email sudah terdaftar. Silakan login.",
        },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        user,
      },
      { status: 201 }
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
