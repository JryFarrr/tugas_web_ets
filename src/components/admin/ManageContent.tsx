"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

import { supabase } from "@/lib/supabaseClient";

type ContentRecord = {
  id: string;
  title: string;
  body: string;
  status: string;
  created_at: string;
};

type ContentForm = {
  title: string;
  body: string;
  status: string;
};

const DEFAULT_FORM: ContentForm = {
  title: "",
  body: "",
  status: "draft",
};

export function ManageContent({ adminId }: { adminId: string }) {
  const [contents, setContents] = useState<ContentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<ContentForm>(DEFAULT_FORM);
  const [editing, setEditing] = useState<ContentRecord | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadContents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await supabase
        .from("admin_contents")
        .select("id, title, body, status, created_at")
        .eq("created_by", adminId)
        .order("created_at", { ascending: false });

      if (queryError) {
        throw queryError;
      }

      setContents(data ?? []);
    } catch (err) {
      console.error("[ManageContent] loadContents", err);
      setError(
        err instanceof Error ? err.message : "Gagal memuat daftar konten.",
      );
    } finally {
      setLoading(false);
    }
  }, [adminId]);

  useEffect(() => {
    void loadContents();
  }, [loadContents]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setError(null);
    try {
      const { error: insertError } = await supabase
        .from("admin_contents")
        .insert({
          title: form.title,
          body: form.body,
          status: form.status,
          created_by: adminId,
        });

      if (insertError) {
        throw insertError;
      }

      setFeedback("Konten berhasil ditambahkan.");
      setForm(DEFAULT_FORM);
      await loadContents();
    } catch (err) {
      console.error("[ManageContent] handleCreate", err);
      setError(
        err instanceof Error ? err.message : "Gagal menambahkan konten.",
      );
    }
  };

  const handleSaveEdit = async () => {
    if (!editing) {
      return;
    }
    setFeedback(null);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from("admin_contents")
        .update({
          title: editing.title,
          body: editing.body,
          status: editing.status,
        })
        .eq("id", editing.id);

      if (updateError) {
        throw updateError;
      }

      setFeedback("Konten berhasil diperbarui.");
      setEditing(null);
      await loadContents();
    } catch (err) {
      console.error("[ManageContent] handleSaveEdit", err);
      setError(
        err instanceof Error ? err.message : "Gagal memperbarui konten.",
      );
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Hapus konten ini? Tindakan tidak dapat dibatalkan.",
    );
    if (!confirmed) {
      return;
    }
    setFeedback(null);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from("admin_contents")
        .delete()
        .eq("id", id);

      if (deleteError) {
        throw deleteError;
      }

      setFeedback("Konten berhasil dihapus.");
      await loadContents();
    } catch (err) {
      console.error("[ManageContent] handleDelete", err);
      setError(
        err instanceof Error ? err.message : "Gagal menghapus konten.",
      );
    }
  };

  return (
    <section className="space-y-8 rounded-3xl border border-slate-800/60 bg-slate-900/70 p-10 shadow-[0_40px_120px_rgba(15,23,42,0.45)]">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">
          Kelola Konten Publik
        </h2>
        <p className="text-sm text-slate-400">
          Buat, ubah, atau hapus konten yang tampil untuk pengguna aplikasi.
        </p>
      </div>

      <form
        className="grid gap-4 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-6"
        onSubmit={handleCreate}
      >
        <div className="text-sm font-semibold text-slate-300">
          Buat Konten Baru
        </div>
        <label className="space-y-2 text-sm">
          <span className="font-medium text-slate-300">Judul konten</span>
          <input
            required
            value={form.title}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, title: event.target.value }))
            }
            className="w-full rounded-xl border border-slate-800 bg-slate-800/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
            placeholder="Judul informatif"
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium text-slate-300">Isi konten</span>
          <textarea
            required
            value={form.body}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, body: event.target.value }))
            }
            rows={4}
            className="w-full rounded-xl border border-slate-800 bg-slate-800/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
            placeholder="Tuliskan deskripsi atau isi konten."
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium text-slate-300">Status</span>
          <select
            value={form.status}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, status: event.target.value }))
            }
            className="w-full rounded-xl border border-slate-800 bg-slate-800/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!form.title.trim() || !form.body.trim()}
          >
            Simpan Konten
          </button>
        </div>
      </form>

      {feedback ? <p className="text-sm text-emerald-400">{feedback}</p> : null}
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Daftar Konten</h3>
        {loading ? (
          <p className="text-sm text-slate-400">Memuat konten...</p>
        ) : contents.length === 0 ? (
          <p className="text-sm text-slate-400">
            Belum ada konten. Buat konten baru menggunakan formulir di atas.
          </p>
        ) : (
          <ul className="space-y-4">
            {contents.map((content) => {
              const isEditing = editing?.id === content.id;
              return (
                <li
                  key={content.id}
                  className="space-y-3 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        value={editing.title}
                        onChange={(event) =>
                          setEditing((prev) =>
                            prev
                              ? { ...prev, title: event.target.value }
                              : prev,
                          )
                        }
                        className="w-full rounded-xl border border-slate-800 bg-slate-800/70 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
                      />
                      <textarea
                        value={editing.body}
                        onChange={(event) =>
                          setEditing((prev) =>
                            prev
                              ? { ...prev, body: event.target.value }
                              : prev,
                          )
                        }
                        rows={4}
                        className="w-full rounded-xl border border-slate-800 bg-slate-800/70 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
                      />
                      <select
                        value={editing.status}
                        onChange={(event) =>
                          setEditing((prev) =>
                            prev
                              ? { ...prev, status: event.target.value }
                              : prev,
                          )
                        }
                        className="w-full rounded-xl border border-slate-800 bg-slate-800/70 px-4 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={handleSaveEdit}
                          className="rounded-lg bg-emerald-500/20 px-3 py-2 text-sm text-emerald-300 transition hover:bg-emerald-500/30"
                        >
                          Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(null)}
                          className="rounded-lg bg-slate-800/60 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800/80"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h4 className="text-lg font-semibold text-white">
                          {content.title}
                        </h4>
                        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-wider text-slate-300">
                          {content.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{content.body}</p>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <button
                          type="button"
                          onClick={() => setEditing(content)}
                          className="rounded-lg bg-slate-800/60 px-3 py-2 text-slate-200 transition hover:bg-slate-800/80"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(content.id)}
                          className="rounded-lg border border-rose-500/40 px-3 py-2 text-rose-400 transition hover:bg-rose-500/10"
                        >
                          Hapus
                        </button>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
