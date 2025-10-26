"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AuthApiError } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabaseClient";

type FormMessage =
  | {
      type: "success" | "error";
      text: string;
    }
  | null;

export default function AdminLoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<FormMessage>(null);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "not_admin") {
      setFormMessage({
        type: "error",
        text: "Akun ini tidak memiliki akses admin.",
      });
    }
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        const message =
          error instanceof AuthApiError && error.status === 400
            ? "Email atau kata sandi salah."
            : error.message === "Email not confirmed"
            ? "Email belum dikonfirmasi. Mohon cek email konfirmasi terlebih dahulu."
            : error.message ?? "Gagal login. Silakan coba lagi.";
        setFormMessage({
          type: "error",
          text: message,
        });
        return;
      }

      if (!data.session) {
        setFormMessage({
          type: "error",
          text: "Sesi tidak tersedia. Coba lagi beberapa saat.",
        });
        return;
      }

      const { data: adminRow, error: adminError } = await supabase
        .from("admin_users")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (adminError) {
        console.error("Gagal memeriksa admin_users:", adminError);
        setFormMessage({
          type: "error",
          text: "Gagal memeriksa hak akses admin.",
        });
        return;
      }

      if (!adminRow) {
        await supabase.auth.signOut();
        setFormMessage({
          type: "error",
          text: "Akun ini tidak terdaftar sebagai admin.",
        });
        return;
      }

      setFormMessage({
        type: "success",
        text: "Login admin berhasil. Mengarahkan ke dashboard...",
      });

      setTimeout(() => {
        router.replace("/admin/dashboard");
      }, 600);
    } catch (error) {
      console.error("Login admin error", error);
      setFormMessage({
        type: "error",
        text: "Terjadi kesalahan internal. Coba lagi nanti.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900/95 px-6 py-16 text-slate-100">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-700/60 bg-slate-900/80 p-10 shadow-[0_40px_120px_rgba(15,23,42,0.45)] backdrop-blur-lg">
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-sky-400">
            Admin Panel
          </p>
          <h1 className="text-3xl font-semibold text-white">
            Login ke Dashboard Admin
          </h1>
          <p className="text-sm text-slate-400">
            Gunakan kredensial admin yang diberikan oleh superadmin.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <label className="block space-y-2 text-sm">
            <span className="font-medium text-slate-300">Email admin</span>
            <input
              type="email"
              value={credentials.email}
              onChange={(event) =>
                setCredentials((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
              placeholder="admin@soulmatch.id"
              required
            />
          </label>

          <label className="block space-y-2 text-sm">
            <span className="font-medium text-slate-300">Kata sandi</span>
            <input
              type="password"
              value={credentials.password}
              onChange={(event) =>
                setCredentials((prev) => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
              placeholder="********"
              required
            />
          </label>

          {formMessage ? (
            <p
              className={`text-sm ${
                formMessage.type === "error"
                  ? "text-rose-400"
                  : "text-emerald-400"
              }`}
            >
              {formMessage.text}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Memproses..." : "Masuk sebagai Admin"}
          </button>
        </form>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <Link href="/" className="hover:text-white hover:underline">
            Kembali ke beranda
          </Link>
          <Link href="/login" className="hover:text-white hover:underline">
            Login pengguna biasa
          </Link>
        </div>
      </div>
    </div>
  );
}
