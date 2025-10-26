"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabaseClient";

type ProfileRow = {
  id: string;
  email: string | null;
  name: string | null;
  age: number | null;
  city: string | null;
  status: string | null;
  pekerjaan: string | null;
  about: string | null;
  interests: string[] | null;
  main_photo: string | null;
  gallery_a: string[] | null;
  gallery_b: string[] | null;
  created_at: string | null;
  updated_at: string | null;
};

type EditableProfile = {
  name: string | null;
  city: string | null;
  status: string | null;
  pekerjaan: string | null;
  about: string | null;
  interestsText: string;
  age: number | null;
};

type CreateFormState = {
  email: string;
  password: string;
  name: string;
  city: string;
  status: string;
  pekerjaan: string;
  about: string;
  interestsText: string;
};

const CREATE_DEFAULT: CreateFormState = {
  email: "",
  password: "",
  name: "",
  city: "",
  status: "",
  pekerjaan: "",
  about: "",
  interestsText: "",
};

const EDIT_DEFAULT: EditableProfile = {
  name: null,
  city: null,
  status: null,
  pekerjaan: null,
  about: null,
  interestsText: "",
  age: null,
};

export function ManageUsers() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<ProfileRow | null>(null);
  const [editing, setEditing] = useState<EditableProfile>(EDIT_DEFAULT);
  const [createForm, setCreateForm] = useState<CreateFormState>(CREATE_DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        throw new Error("Sesi admin tidak ditemukan. Silakan login ulang.");
      }

      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message ?? "Gagal memuat data pengguna.");
      }

      const body = (await response.json()) as { users: ProfileRow[] };
      setProfiles(body.users);
    } catch (err) {
      console.error("[ManageUsers] loadProfiles", err);
      setError(
        err instanceof Error ? err.message : "Gagal memuat data pengguna.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfiles();
  }, [loadProfiles]);

  const startEdit = (profile: ProfileRow) => {
    setSelectedProfile(profile);
    setEditing({
      name: profile.name,
      city: profile.city,
      status: profile.status,
      pekerjaan: profile.pekerjaan,
      about: profile.about,
      interestsText: profile.interests?.join(", ") ?? "",
      age: profile.age,
    });
    setFeedback(null);
    setError(null);
  };

  const columns = useMemo(
    () => [
      { id: "id", label: "ID", width: "250px" },
      { id: "email", label: "Email", width: "220px" },
      { id: "name", label: "Nama", width: "180px" },
      { id: "age", label: "Usia", width: "80px" },
      { id: "city", label: "Kota", width: "160px" },
      { id: "status", label: "Status", width: "180px" },
      { id: "pekerjaan", label: "Pekerjaan", width: "200px" },
      { id: "about", label: "About", width: "280px" },
      { id: "interests", label: "Interests", width: "240px" },
      { id: "created_at", label: "Dibuat", width: "200px" },
      { id: "updated_at", label: "Diubah", width: "200px" },
    ],
    [],
  );

  const formatDate = (value: string | null) =>
    value ? new Date(value).toLocaleString() : "-";

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProfile) {
      return;
    }
    setSaving(true);
    setFeedback(null);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        throw new Error("Sesi admin tidak ditemukan. Silakan login ulang.");
      }

      const interests =
        editing.interestsText
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item.length) ?? [];
      const response = await fetch(`/api/admin/users/${selectedProfile.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editing.name,
          city: editing.city,
          status: editing.status,
          pekerjaan: editing.pekerjaan,
          about: editing.about,
          interests,
          age: editing.age,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message ?? "Gagal menyimpan perubahan.");
      }

      setFeedback("Profil pengguna berhasil diperbarui.");
      setSelectedProfile(null);
      setEditing(EDIT_DEFAULT);
      await loadProfiles();
    } catch (err) {
      console.error("[ManageUsers] handleUpdate", err);
      setError(err instanceof Error ? err.message : "Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreating(true);
    setFeedback(null);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        throw new Error("Sesi admin tidak ditemukan. Silakan login ulang.");
      }

      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: createForm.email.trim(),
          password: createForm.password,
          name: createForm.name.trim() || null,
          city: createForm.city.trim() || null,
          status: createForm.status.trim() || null,
          pekerjaan: createForm.pekerjaan.trim() || null,
          about: createForm.about.trim() || null,
          interests: createForm.interestsText
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item.length),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message ?? "Gagal menambahkan pengguna.");
      }

      setCreateForm(CREATE_DEFAULT);
      setFeedback("Pengguna baru berhasil dibuat.");
      await loadProfiles();
    } catch (err) {
      console.error("[ManageUsers] handleCreate", err);
      setError(err instanceof Error ? err.message : "Gagal membuat pengguna baru.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="space-y-8 rounded-3xl border border-slate-800/60 bg-slate-900/70 p-10 shadow-[0_40px_120px_rgba(15,23,42,0.45)]">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">
          Kelola Pengguna SoulMatch
        </h2>
        <p className="text-sm text-slate-400">
          Admin dapat menambahkan, melihat, dan memperbarui profil pengguna.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="grid gap-4 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-6 md:grid-cols-3"
      >
        <div className="md:col-span-3 text-sm font-semibold text-slate-300">
          Tambah Pengguna Baru
        </div>
        <label className="space-y-1 text-sm">
          <span className="text-slate-300">Email</span>
          <input
            required
            type="email"
            value={createForm.email}
            onChange={(event) =>
              setCreateForm((prev) => ({ ...prev, email: event.target.value }))
            }
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
            placeholder="user@soulmatch.id"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-slate-300">Password</span>
          <input
            required
            type="password"
            minLength={6}
            value={createForm.password}
            onChange={(event) =>
              setCreateForm((prev) => ({ ...prev, password: event.target.value }))
            }
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
            placeholder="Minimal 6 karakter"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-slate-300">Nama</span>
          <input
            value={createForm.name}
            onChange={(event) =>
              setCreateForm((prev) => ({ ...prev, name: event.target.value }))
            }
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-slate-300">Kota</span>
          <input
            value={createForm.city}
            onChange={(event) =>
              setCreateForm((prev) => ({ ...prev, city: event.target.value }))
            }
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-slate-300">Status</span>
          <input
            value={createForm.status}
            onChange={(event) =>
              setCreateForm((prev) => ({ ...prev, status: event.target.value }))
            }
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-slate-300">Pekerjaan</span>
          <input
            value={createForm.pekerjaan}
            onChange={(event) =>
              setCreateForm((prev) => ({ ...prev, pekerjaan: event.target.value }))
            }
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
          />
        </label>
        <label className="md:col-span-3 space-y-1 text-sm">
          <span className="text-slate-300">Tentang</span>
          <textarea
            value={createForm.about}
            onChange={(event) =>
              setCreateForm((prev) => ({ ...prev, about: event.target.value }))
            }
            rows={2}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
          />
        </label>
        <label className="md:col-span-3 space-y-1 text-sm">
          <span className="text-slate-300">Interests (pisahkan dengan koma)</span>
          <textarea
            value={createForm.interestsText}
            onChange={(event) =>
              setCreateForm((prev) => ({
                ...prev,
                interestsText: event.target.value,
              }))
            }
            rows={2}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
          />
        </label>
        <div className="md:col-span-3 flex justify-end">
          <button
            type="submit"
            disabled={creating}
            className="rounded-lg bg-sky-500/20 px-4 py-2 text-sm font-semibold text-sky-300 transition hover:bg-sky-500/30 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? "Menambah..." : "Tambah Pengguna"}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-slate-400">Memuat daftar pengguna...</p>
      ) : error ? (
        <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </p>
      ) : (
        <div className="space-y-6">
          <div className="overflow-x-auto rounded-2xl border border-slate-800/70 bg-slate-900/60">
            <table className="min-w-[1600px] table-auto border-collapse">
              <thead>
                <tr className="bg-slate-900/80 text-left text-xs uppercase tracking-wider text-slate-400">
                  {columns.map((column) => (
                    <th
                      key={column.id}
                      className="px-4 py-3 font-semibold"
                      style={{ width: column.width }}
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-slate-400">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <tr
                    key={profile.id}
                    className="border-t border-slate-800/60 text-sm text-slate-200 hover:bg-slate-800/40"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">
                      {profile.id}
                    </td>
                    <td className="px-4 py-3">{profile.email ?? "-"}</td>
                    <td className="px-4 py-3">{profile.name ?? "-"}</td>
                    <td className="px-4 py-3">
                      {profile.age !== null ? profile.age : "-"}
                    </td>
                    <td className="px-4 py-3">{profile.city ?? "-"}</td>
                    <td className="px-4 py-3">{profile.status ?? "-"}</td>
                    <td className="px-4 py-3">{profile.pekerjaan ?? "-"}</td>
                    <td className="px-4 py-3 text-xs text-slate-300">
                      {profile.about ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-300">
                      {profile.interests && profile.interests.length
                        ? profile.interests.join(", ")
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {formatDate(profile.created_at)}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {formatDate(profile.updated_at)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => startEdit(profile)}
                        className="rounded-lg bg-slate-800/70 px-3 py-1 text-xs text-slate-200 transition hover:bg-slate-800/90"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-6">
            <h3 className="text-sm font-semibold text-slate-200">
              {selectedProfile
                ? `Edit profil: ${selectedProfile.email ?? selectedProfile.id}`
                : "Pilih baris di tabel untuk diedit"}
            </h3>

            {selectedProfile ? (
              <form
                onSubmit={handleUpdate}
                className="mt-4 grid gap-4 text-sm md:grid-cols-2"
              >
                <label className="space-y-1">
                  <span className="text-slate-300">Nama</span>
                  <input
                    value={editing.name ?? ""}
                    onChange={(event) =>
                      setEditing((prev) => ({ ...prev, name: event.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-slate-300">Kota</span>
                  <input
                    value={editing.city ?? ""}
                    onChange={(event) =>
                      setEditing((prev) => ({ ...prev, city: event.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-slate-300">Status</span>
                  <input
                    value={editing.status ?? ""}
                    onChange={(event) =>
                      setEditing((prev) => ({
                        ...prev,
                        status: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-slate-300">Pekerjaan</span>
                  <input
                    value={editing.pekerjaan ?? ""}
                    onChange={(event) =>
                      setEditing((prev) => ({
                        ...prev,
                        pekerjaan: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
                  />
                </label>
                <label className="space-y-1">
                  <span className="text-slate-300">Usia</span>
                  <input
                    type="number"
                    min={18}
                    max={90}
                    value={editing.age ?? ""}
                    onChange={(event) =>
                      setEditing((prev) => ({
                        ...prev,
                        age: event.target.value
                          ? Number.parseInt(event.target.value, 10)
                          : null,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
                  />
                </label>
                <label className="md:col-span-2 space-y-1">
                  <span className="text-slate-300">Tentang</span>
                  <textarea
                    value={editing.about ?? ""}
                    onChange={(event) =>
                      setEditing((prev) => ({
                        ...prev,
                        about: event.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
                    placeholder="Deskripsi singkat pengguna"
                  />
                </label>
                <label className="md:col-span-2 space-y-1">
                  <span className="text-slate-300">Interests (pisahkan dengan koma)</span>
                  <textarea
                    value={editing.interestsText}
                    onChange={(event) =>
                      setEditing((prev) => ({
                        ...prev,
                        interestsText: event.target.value,
                      }))
                    }
                    rows={2}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
                  />
                </label>
                <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Menyimpan..." : "Simpan perubahan"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProfile(null);
                      setEditing(EDIT_DEFAULT);
                    }}
                    className="rounded-lg bg-slate-800/70 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800/90"
                  >
                    Batal
                  </button>
                </div>
              </form>
            ) : (
              <p className="mt-4 text-sm text-slate-400">
                Klik salah satu pengguna di daftar untuk melihat detailnya.
              </p>
            )}
          </div>
        </div>
      )}

      {feedback ? (
        <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {feedback}
        </p>
            ) : null}
    </section>
  );
}
