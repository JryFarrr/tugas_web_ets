"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthApiError } from "@supabase/supabase-js";

import coupleImage from "@/assets/couple-hug.png";
import { supabase } from "@/lib/supabaseClient";

type FieldErrors = Partial<
  Record<"email" | "name" | "password" | "confirmPassword", string>
>;

type FormMessage =
  | {
      type: "success" | "error";
      text: string;
    }
  | null;

export default function SignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<FieldErrors>({});
  const [formMessage, setFormMessage] = useState<FormMessage>(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});
    setFormMessage(null);

    const validationErrors: FieldErrors = {};

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailPattern.test(formData.email)) {
      validationErrors.email = "Masukkan email yang valid.";
    }

    if (!formData.name || formData.name.trim().length < 2) {
      validationErrors.name = "Nama minimal 2 karakter.";
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordPattern.test(formData.password)) {
      validationErrors.password =
        "Minimal 8 karakter, sertakan huruf kapital dan angka.";
    }

    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Konfirmasi password tidak sesuai.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      setFormMessage({
        type: "error",
        text: "Periksa kembali data yang kamu isi.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const redirectTo =
        typeof window !== "undefined" ? `${window.location.origin}/login` : undefined;

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        const message =
          error instanceof AuthApiError && error.status === 422
            ? "Email sudah terdaftar. Silakan login."
            : error.message ?? "Pendaftaran gagal. Silakan coba lagi.";

        if (
          error instanceof AuthApiError &&
          (error.status === 400 || error.status === 422)
        ) {
          setFormErrors((prev) => ({
            ...prev,
            email: message,
          }));
        }

        setFormMessage({
          type: "error",
          text: message,
        });
        return;
      }

      if (data.user) {
        try {
          if (data.session) {
            await supabase
              .from("profiles")
              .upsert(
                {
                  id: data.user.id,
                  name: formData.name,
                },
                { onConflict: "id" },
              );
          }
        } catch (profileError) {
          console.warn("Gagal membuat profil awal:", profileError);
        }
      }

      setFormMessage({
        type: "success",
        text:
          "Pendaftaran berhasil! Cek email kamu untuk konfirmasi sebelum login.",
      });
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
            alt="SoulMatch couple signup"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 space-y-3 bg-black/35 p-8 text-white backdrop-blur-md md:rounded-tr-[36px]">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70">
              SoulMatch
            </p>
            <h1 className="text-2xl font-semibold leading-snug">
              Buat profil hangat untuk cerita baru yang lebih berarti.
            </h1>
            <p className="text-sm text-white/80">
              Personalisasi preferensi kamu dan kami akan menyiapkan vibe match
              terbaik untuk memulai percakapan.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col justify-center gap-8 bg-white/95 p-10 md:w-1/2">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-rose-400/70">
              Buat akun
            </p>
            <h2 className="text-3xl font-semibold text-neutral-900">
              Buka peluang cerita baru
            </h2>
            <p className="text-sm text-neutral-400">
              Cukup isi beberapa detail dan kamu siap menjelajah SoulMatch.
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
                value={formData.email}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
                aria-invalid={Boolean(formErrors.email)}
                aria-describedby={formErrors.email ? "signup-email-error" : undefined}
              />
              {formErrors.email ? (
                <p id="signup-email-error" className="text-xs text-rose-500">
                  {formErrors.email}
                </p>
              ) : null}
            </label>

            <label className="block space-y-2 text-sm">
              <span className="font-medium text-neutral-500">Nama lengkap</span>
              <input
                className="w-full rounded-2xl border border-rose-100 bg-white/80 px-4 py-3 text-neutral-600 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                placeholder="Sarah McMayer"
                type="text"
                name="name"
                value={formData.name}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                aria-invalid={Boolean(formErrors.name)}
                aria-describedby={formErrors.name ? "signup-name-error" : undefined}
              />
              {formErrors.name ? (
                <p id="signup-name-error" className="text-xs text-rose-500">
                  {formErrors.name}
                </p>
              ) : null}
            </label>

            <label className="block space-y-2 text-sm">
              <span className="font-medium text-neutral-500">Kata sandi</span>
              <input
                className="w-full rounded-2xl border border-rose-100 bg-white/80 px-4 py-3 text-neutral-600 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                placeholder="********"
                type="password"
                name="password"
                value={formData.password}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                aria-invalid={Boolean(formErrors.password)}
                aria-describedby={
                  formErrors.password ? "signup-password-error" : undefined
                }
              />
              {formErrors.password ? (
                <p id="signup-password-error" className="text-xs text-rose-500">
                  {formErrors.password}
                </p>
              ) : null}
            </label>

            <label className="block space-y-2 text-sm">
              <span className="font-medium text-neutral-500">
                Konfirmasi kata sandi
              </span>
              <input
                className="w-full rounded-2xl border border-rose-100 bg-white/80 px-4 py-3 text-neutral-600 outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                placeholder="********"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: event.target.value,
                  }))
                }
                aria-invalid={Boolean(formErrors.confirmPassword)}
                aria-describedby={
                  formErrors.confirmPassword
                    ? "signup-confirm-password-error"
                    : undefined
                }
              />
              {formErrors.confirmPassword ? (
                <p
                  id="signup-confirm-password-error"
                  className="text-xs text-rose-500"
                >
                  {formErrors.confirmPassword}
                </p>
              ) : null}
            </label>

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
              {isSubmitting ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-400">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-rose-500 hover:underline"
            >
              Masuk sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
