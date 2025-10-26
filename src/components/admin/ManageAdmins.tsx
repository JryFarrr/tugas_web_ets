"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabaseClient";

type AdminRecord = {
  id: string;
  email: string;
  role: "superadmin" | "admin";
  created_at: string;
};

type FormState = {
  email: string;
  password: string;
  role: "superadmin" | "admin";
};

const DEFAULT_FORM: FormState = {
  email: "",
  password: "",
  role: "admin",
};

export function ManageAdmins() {
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const sortedAdmins = useMemo(
    () =>
      [...admins].sort((a, b) =>
        a.role === b.role
          ? a.email.localeCompare(b.email)
          : a.role === "superadmin"
          ? -1
          : 1,
      ),
    [admins],
  );

  useEffect(() => {
    void loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        throw new Error("Sesi admin tidak ditemukan.");
      }

      const response = await fetch("/api/admin/admins", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message ?? "Gagal memuat daftar admin.");
      }

      const body = (await response.json()) as { admins: AdminRecord[] };
      setAdmins(body.admins);
    } catch (err) {
      console.error("[ManageAdmins] loadAdmins", err);
      setError(
        err instanceof Error ? err.message : "Gagal memuat daftar admin.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        throw new Error("Sesi admin tidak ditemukan.");
      }

      const response = await fetch("/api/admin/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.message ?? "Gagal membuat admin baru. Coba lagi nanti.",
        );
      }

      setStatus("Admin baru berhasil dibuat.");
      setForm(DEFAULT_FORM);
      await loadAdmins();
    } catch (err) {
      console.error("[ManageAdmins] handleCreate", err);
      setError(err instanceof Error ? err.message : "Gagal membuat admin.");
    }
  };

  const handleUpdateRole = async (id: string, role: "superadmin" | "admin") => {
    setSavingId(id);
    setStatus(null);
    setError(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        throw new Error("Sesi admin tidak ditemukan.");
      }

      const response = await fetch(`/api/admin/admins/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.message ?? "Gagal memperbarui peran admin. Coba lagi.",
        );
      }

      setStatus("Peran admin berhasil diperbarui.");
      await loadAdmins();
    } catch (err) {
      console.error("[ManageAdmins] handleUpdateRole", err);
      setError(
        err instanceof Error ? err.message : "Gagal memperbarui peran admin.",
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Hapus admin ini? Tindakan ini tidak dapat dibatalkan.",
    );
    if (!confirmed) {
      return;
    }
    setSavingId(id);
    setStatus(null);
    setError(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        throw new Error("Sesi admin tidak ditemukan.");
      }

      const response = await fetch(`/api/admin/admins/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message ?? "Gagal menghapus admin.");
      }

      setStatus("Admin berhasil dihapus.");
      await loadAdmins();
    } catch (err) {
      console.error("[ManageAdmins] handleDelete", err);
      setError(err instanceof Error ? err.message : "Gagal menghapus admin.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section className="space-y-8 rounded-3xl border border-slate-800/60 bg-slate-900/70 p-10 shadow-[0_40px_120px_rgba(15,23,42,0.45)]">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">
          Kelola Admin & Superadmin
        </h2>
        <p className="text-sm text-slate-400">
          Superadmin dapat membuat admin baru, mengubah peran, atau menghapus
          akses.
        </p>
      </div>

      <form
        className="grid gap-4 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-6 md:grid-cols-2"
        onSubmit={handleCreate}
      >
        <div className="md:col-span-2 text-sm font-semibold text-slate-300">
          Tambah Admin Baru
        </div>
        <label className="space-y-2 text-sm">
          <span className="font-medium text-slate-300">Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
            className="w-full rounded-xl border border-slate-800 bg-slate-800/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
            placeholder="admin@soulmatch.id"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium text-slate-300">Kata sandi sementara</span>
          <input
            type="password"
            required
            value={form.password}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, password: event.target.value }))
            }
            className="w-full rounded-xl border border-slate-800 bg-slate-800/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
            placeholder="Minimal 6 karakter"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium text-slate-300">Peran</span>
          <select
            value={form.role}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                role: event.target.value as FormState["role"],
              }))
            }
            className="w-full rounded-xl border border-slate-800 bg-slate-800/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
          >
            <option value="admin">Admin (kelola konten)</option>
            <option value="superadmin">Superadmin</option>
          </select>
        </label>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isNaN(form.password.length) || form.password.length < 6}
          >
            Tambah Admin
          </button>
        </div>
      </form>

      {status ? <p className="text-sm text-emerald-400">{status}</p> : null}
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Daftar Admin</h3>
        {loading ? (
          <p className="text-sm text-slate-400">Memuat daftar admin...</p>
        ) : sortedAdmins.length === 0 ? (
          <p className="text-sm text-slate-400">
            Belum ada admin yang terdaftar.
          </p>
        ) : (
          <ul className="space-y-3">
            {sortedAdmins.map((admin) => (
              <li
                key={admin.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    {admin.email}
                  </p>
                  <p className="text-xs uppercase tracking-wider text-sky-400/80">
                    {admin.role}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <select
                    value={admin.role}
                    onChange={(event) =>
                      handleUpdateRole(
                        admin.id,
                        event.target.value as AdminRecord["role"],
                      )
                    }
                    disabled={savingId === admin.id}
                    className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-200"
                  >
                    <option value="superadmin">Superadmin</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleDelete(admin.id)}
                    disabled={savingId === admin.id || admin.role === "superadmin"}
                    className="rounded-lg border border-rose-500/40 px-3 py-2 text-rose-400 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
