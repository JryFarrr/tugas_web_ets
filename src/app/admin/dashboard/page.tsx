"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabaseClient";
import { ManageAdmins } from "@/components/admin/ManageAdmins";
import { ManageUsers } from "@/components/admin/ManageUsers";

type AdminRole = "superadmin" | "admin";

type AdminState =
  | { status: "loading" }
  | { status: "unauthorized"; reason: "not_logged_in" | "not_admin" }
  | {
      status: "ready";
      role: AdminRole;
      email: string | null;
      userId: string;
    };

export default function AdminDashboardPage() {
  const router = useRouter();
  const [state, setState] = useState<AdminState>({ status: "loading" });

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        if (active) {
          setState({ status: "unauthorized", reason: "not_logged_in" });
          router.replace("/admin/login");
        }
        return;
      }

      const { data: adminRow, error } = await supabase
        .from("admin_users")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error || !adminRow) {
        await supabase.auth.signOut();
        if (active) {
          setState({ status: "unauthorized", reason: "not_admin" });
          router.replace("/admin/login?message=not_admin");
        }
        return;
      }

      if (active) {
        setState({
          status: "ready",
          role: adminRow.role as AdminRole,
          email: session.user.email ?? null,
          userId: session.user.id,
        });
      }
    }

    void bootstrap();

    return () => {
      active = false;
    };
  }, [router]);

  const headline = useMemo(() => {
    if (state.status !== "ready") {
      return "Memuat dashboard admin...";
    }
    return state.role === "superadmin"
      ? "Panel Superadmin"
      : "Panel Admin Konten";
  }, [state]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 py-16">
      <header className="rounded-3xl border border-slate-800/60 bg-slate-900/70 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.45)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-sky-400/80">
              SoulMatch Admin
            </p>
            <h1 className="text-3xl font-semibold text-white">{headline}</h1>
          </div>
          {state.status === "ready" ? (
            <div className="text-sm text-slate-400">
              <p>
                Masuk sebagai{" "}
                <span className="font-semibold text-slate-200">
                  {state.email ?? state.userId}
                </span>
              </p>
              <p className="text-xs uppercase tracking-wider text-sky-400/80">
                {state.role}
              </p>
            </div>
          ) : null}
        </div>
      </header>

      {state.status === "loading" ? (
        <p className="text-center text-slate-400">
          Memeriksa hak akses admin...
        </p>
      ) : null}

      {state.status === "unauthorized" ? (
        <section className="rounded-3xl border border-slate-800/60 bg-slate-900/70 p-10 text-center text-sm text-rose-400">
          {state.reason === "not_logged_in"
            ? "Sesi admin tidak ditemukan. Silakan login terlebih dahulu."
            : "Akun yang digunakan tidak memiliki akses admin."}
        </section>
      ) : null}

      {state.status === "ready" && state.role === "superadmin" ? (
        <>
          <ManageAdmins />
          <ManageUsers />
        </>
      ) : null}

      {state.status === "ready" && state.role === "admin" ? <ManageUsers /> : null}
    </main>
  );
}
