"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthApiError } from "@supabase/supabase-js";

import coupleImage from "@/assets/couple-hug.png";
import { supabase } from "@/lib/supabaseClient";

type FieldErrors = Partial<Record<"email" | "password", string>>;
type FormMessage =
  | {
      type: "success" | "error";
      text: string;
    }
  | null;

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<FormMessage>(null);
  const [formErrors, setFormErrors] = useState<FieldErrors>({});
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormMessage(null);
    setFormErrors({});

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
            ? "Email kamu belum dikonfirmasi. Cek inbox dan klik tautan verifikasi terlebih dahulu."
            : error.message ?? "Gagal login. Silakan coba lagi.";

        setFormMessage({
          type: "error",
          text: message,
        });
        return;
      }

      if (data.user && !data.session) {
        setFormMessage({
          type: "error",
          text: "Email kamu belum diverifikasi. Silakan cek kotak masuk dan konfirmasi sebelum login.",
        });
        return;
      }

      if (data.user) {
        try {
          const metadata = data.user.user_metadata ?? {};
          const profileName =
            (metadata.full_name as string | undefined) ??
            (metadata.name as string | undefined);

          await supabase
            .from("profiles")
            .upsert(
              {
                id: data.user.id,
                ...(profileName ? { name: profileName } : {}),
              },
              { onConflict: "id" },
            );
        } catch (profileError) {
          console.warn("Gagal sinkronisasi profil:", profileError);
        }
      }

      setFormMessage({
        type: "success",
        text: "Login berhasil! Mengarahkan ke dashboard...",
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 900);
    } catch (error) {
      console.error(error);
      setFormMessage({
        type: "error",
        text: "Terjadi kesalahan tidak terduga. Coba lagi nanti.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fef4f7] via-[#fff6ed] to-[#efe8ff] px-6 py-16">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-[36px] border border-white/70 bg-white/80 shadow-[0_45px_120px_rgba(252,190,180,0.35)] backdrop-blur-lg flex-col md:flex-row">
        <div className="relative h-64 w-full overflow-hidden md:h-auto md:w-1/2">
          <Image
            src={coupleImage}
            alt="SoulMatch couple"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 space-y-4 bg-black/35 p-8 text-white backdrop-blur-md md:rounded-tr-[36px]">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">
              SoulMatch
            </p>
            <h1 className="text-2xl font-semibold leading-snug">
              Bertemu pasangan yang sefrekuensi dengan nuansa hangat SoulMatch.
            </h1>
            <ul className="grid gap-2 text-sm text-white/80">
              <li>
                <span className="font-semibold text-white">Kencan Aman</span> —
                verifikasi profil berlapis menjaga ruang nyaman.
              </li>
              <li>
                <span className="font-semibold text-white">Mood Tracking</span> —
                bagikan suasana hati untuk rekomendasi akurat.
              </li>
              <li>
                <span className="font-semibold text-white">Rencana Nyata</span> —
                catat ide hangout langsung dari percakapan favoritmu.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex w-full flex-col justify-center gap-8 bg-white/95 p-10 md:w-1/2">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-rose-400/70">
              Masuk akun
            </p>
            <h2 className="text-3xl font-semibold text-neutral-900">
              Bergabung bersama SoulMatch
            </h2>
            <p className="text-sm text-neutral-400">
              Hai, selamat datang kembali. Login untuk melanjutkan percakapan
              hangatmu.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <label className="block space-y-2 text-sm">
              <span className="font-medium text-neutral-500">Alamat email</span>
              <input
                className="w-full rounded-2xl border border-rose-100 bg-white/80 px-4 py-3 text-neutral-600 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                placeholder="jennetmayer@konmars.com"
                type="email"
                name="email"
                value={credentials.email}
                onChange={(event) =>
                  setCredentials((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
                aria-invalid={Boolean(formErrors.email)}
                aria-describedby={formErrors.email ? "email-error" : undefined}
              />
              {formErrors.email ? (
                <p id="email-error" className="text-xs text-rose-500">
                  {formErrors.email}
                </p>
              ) : null}
            </label>

            <label className="block space-y-2 text-sm">
              <span className="flex items-center justify-between font-medium text-neutral-500">
                Kata sandi
                <Link
                  href="#"
                  className="text-xs font-semibold text-rose-500 hover:underline"
                >
                  Lupa?
                </Link>
              </span>
              <input
                className="w-full rounded-2xl border border-rose-100 bg-white/80 px-4 py-3 text-neutral-600 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                placeholder="********"
                type="password"
                name="password"
                value={credentials.password}
                onChange={(event) =>
                  setCredentials((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                aria-invalid={Boolean(formErrors.password)}
                aria-describedby={
                  formErrors.password ? "password-error" : undefined
                }
              />
            </label>

            {formErrors.password ? (
              <p id="password-error" className="text-xs text-rose-500">
                {formErrors.password}
              </p>
            ) : null}

            {formMessage ? (
              <p
                className={`text-sm ${
                  formMessage.type === "error"
                    ? "text-rose-500"
                    : "text-emerald-500"
                }`}
              >
                {formMessage.text}
              </p>
            ) : null}

            <button
              className="mt-2 w-full rounded-2xl bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(252,190,180,0.4)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-400">
            Belum punya akun?{" "}
            <Link
              href="/signup"
              className="font-semibold text-rose-500 hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
