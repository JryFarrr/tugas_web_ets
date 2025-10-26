"use client";

import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { DashboardShell, useDashboardTheme } from "@/components/DashboardShell";
import { supabase } from "@/lib/supabaseClient";

const PROFILE_STORAGE_BUCKET =
  process.env.NEXT_PUBLIC_SUPABASE_PROFILE_BUCKET ?? "profile-photos";

const DEFAULT_PROFILE_PHOTO =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=640&q=80";

type ProfileFormState = {
  name: string;
  age: string;
  city: string;
  status: string;
  pekerjaan: string;
  about: string;
  interests: string[];
  mainPhoto: string | null;
  galleryA: string[];
  galleryB: string[];
};

type PendingUpload = {
  file: File;
  preview: string;
};

const EMPTY_FORM: ProfileFormState = {
  name: "",
  age: "",
  city: "",
  status: "",
  pekerjaan: "",
  about: "",
  interests: [],
  mainPhoto: null,
  galleryA: [],
  galleryB: [],
};

export default function EditProfilePage() {
  const [profileImageSrc, setProfileImageSrc] = useState<string | null>(
    DEFAULT_PROFILE_PHOTO,
  );

  return (
    <DashboardShell
      headerChips={[]}
      headerShowSearch={false}
      headerSubtitle="Profil"
      headerHeadline="Ubah informasi profilmu"
      headerStatusBadge="Jangan lupa simpan perubahan"
      profileImageSrc={profileImageSrc ?? DEFAULT_PROFILE_PHOTO}
    >
      <EditProfileContent onProfileImageChange={setProfileImageSrc} />
    </DashboardShell>
  );
}

type EditProfileContentProps = {
  onProfileImageChange: (src: string | null) => void;
};

function EditProfileContent({
  onProfileImageChange,
}: EditProfileContentProps) {
  const router = useRouter();
  const { themeName } = useDashboardTheme();
  const isPink = themeName === "pink";

  const [formState, setFormState] = useState<ProfileFormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [interestInput, setInterestInput] = useState("");
  const [mainPhotoFile, setMainPhotoFile] = useState<File | null>(null);
  const [mainPhotoPreview, setMainPhotoPreview] = useState<string | null>(null);
  const [galleryAUploads, setGalleryAUploads] = useState<PendingUpload[]>([]);
  const [galleryBUploads, setGalleryBUploads] = useState<PendingUpload[]>([]);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError(null);

      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;

        if (!session) {
          throw new Error("Sesi tidak ditemukan. Silakan login kembali.");
        }

        const { data: row, error: fetchError } = await supabase
          .from("profiles")
          .select(
            "name, age, city, status, pekerjaan, about, interests, main_photo, gallery_a, gallery_b",
          )
          .eq("id", session.user.id)
          .maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        const metadata = session.user.user_metadata ?? {};
        const fallbackName =
          (metadata.full_name as string | undefined) ??
          (metadata.name as string | undefined) ??
          session.user.email ??
          "";

        const nextState: ProfileFormState = {
          name: row?.name?.trim() ? row.name : fallbackName,
          age: typeof row?.age === "number" ? String(row.age) : "",
          city: row?.city ?? "",
          status: row?.status ?? "",
          pekerjaan: row?.pekerjaan ?? "",
          about: row?.about ?? "",
          interests: Array.isArray(row?.interests)
            ? row.interests.filter(
                (item: unknown): item is string => typeof item === "string",
              )
            : [],
          mainPhoto:
            row?.main_photo && row.main_photo.trim().length
              ? row.main_photo
              : null,
          galleryA: Array.isArray(row?.gallery_a)
            ? row.gallery_a.filter(
                (item: unknown): item is string => typeof item === "string",
              )
            : [],
          galleryB: Array.isArray(row?.gallery_b)
            ? row.gallery_b.filter(
                (item: unknown): item is string => typeof item === "string",
              )
            : [],
        };

        if (active) {
          setFormState(nextState);
          onProfileImageChange(nextState.mainPhoto ?? DEFAULT_PROFILE_PHOTO);
        }
      } catch (err) {
        if (active) {
          const message =
            err instanceof Error
              ? err.message
              : "Gagal memuat data profil. Coba lagi.";
          setError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, [onProfileImageChange]);

  useEffect(() => {
    onProfileImageChange(
      mainPhotoPreview ?? formState.mainPhoto ?? DEFAULT_PROFILE_PHOTO,
    );
  }, [formState.mainPhoto, mainPhotoPreview, onProfileImageChange]);

  useEffect(() => {
    return () => {
      if (mainPhotoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(mainPhotoPreview);
      }
      galleryAUploads.forEach((item) => {
        if (item.preview.startsWith("blob:")) {
          URL.revokeObjectURL(item.preview);
        }
      });
      galleryBUploads.forEach((item) => {
        if (item.preview.startsWith("blob:")) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, [galleryAUploads, galleryBUploads, mainPhotoPreview]);

  const formClasses = useMemo(
    () =>
      isPink
        ? "space-y-8 rounded-3xl border border-white/70 bg-white/95 p-8 shadow-[0_45px_120px_rgba(249,115,164,0.2)] backdrop-blur transition-colors duration-500"
        : "space-y-8 rounded-3xl border border-white/80 bg-white/98 p-8 shadow-[0_45px_120px_rgba(79,70,229,0.18)] backdrop-blur transition-colors duration-500",
    [isPink],
  );

  const submitButtonClasses = useMemo(
    () =>
      isPink
        ? "rounded-full bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-200/80 transition hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed"
        : "rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-200/80 transition hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed",
    [isPink],
  );

  const inputBorder = isPink
    ? "border-rose-100 focus:border-rose-200"
    : "border-sky-100 focus:border-sky-300";
  const inputShadow = isPink ? "shadow-rose-100/70" : "shadow-sky-100/70";

  const handleFieldChange =
    (field: keyof ProfileFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormState((prev) => ({ ...prev, [field]: value }));
      setSuccess(null);
    };

  const handleRemoveMainPhoto = () => {
    if (mainPhotoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(mainPhotoPreview);
    }
    setMainPhotoPreview(null);
    setMainPhotoFile(null);
    setFormState((prev) => ({ ...prev, mainPhoto: null }));
  };

  const handleMainPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (mainPhotoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(mainPhotoPreview);
    }
    setMainPhotoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setMainPhotoPreview(previewUrl);
    setSuccess(null);
    event.target.value = "";
  };

  const addPendingUploads = (
    files: FileList | null,
    setState: Dispatch<SetStateAction<PendingUpload[]>>,
  ) => {
    if (!files || !files.length) {
      return;
    }
    const nextUploads: PendingUpload[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setState((prev) => [...prev, ...nextUploads]);
    setSuccess(null);
  };

  const handleGalleryChange =
    (gallery: "a" | "b") => (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (gallery === "a") {
        addPendingUploads(files, setGalleryAUploads);
      } else {
        addPendingUploads(files, setGalleryBUploads);
      }
      event.target.value = "";
    };

  const handleRemovePendingUpload = (gallery: "a" | "b", index: number) => {
    const setState =
      gallery === "a" ? setGalleryAUploads : setGalleryBUploads;
    setState((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed?.preview.startsWith("blob:")) {
        URL.revokeObjectURL(removed.preview);
      }
      return next;
    });
  };

  const handleRemoveGalleryUrl = (gallery: "a" | "b", url: string) => {
    setFormState((prev) => {
      if (gallery === "a") {
        return {
          ...prev,
          galleryA: prev.galleryA.filter((item) => item !== url),
        };
      }
      return {
        ...prev,
        galleryB: prev.galleryB.filter((item) => item !== url),
      };
    });
    setSuccess(null);
  };

  const handleRemoveInterest = (interest: string) => {
    setFormState((prev) => ({
      ...prev,
      interests: prev.interests.filter((item) => item !== interest),
    }));
    setSuccess(null);
  };

  const handleAddInterest = () => {
    const value = interestInput.trim();
    if (!value) {
      return;
    }
    setFormState((prev) => {
      if (prev.interests.includes(value) || prev.interests.length >= 20) {
        return prev;
      }
      return {
        ...prev,
        interests: [...prev.interests, value],
      };
    });
    setInterestInput("");
    setSuccess(null);
  };

  const uploadFileToBucket = async (
    file: File,
    userId: string,
    category: "main" | "gallery_a" | "gallery_b",
  ) => {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const randomId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    const objectPath = `profiles/${userId}/${category}-${Date.now()}-${randomId}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(PROFILE_STORAGE_BUCKET)
      .upload(objectPath, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type || undefined,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(PROFILE_STORAGE_BUCKET).getPublicUrl(objectPath);

    return publicUrl;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading || saving) {
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        throw new Error("Sesi tidak ditemukan. Silakan login kembali.");
      }

      const userId = session.user.id;
      let mainPhotoUrl = formState.mainPhoto;

      if (mainPhotoFile) {
        mainPhotoUrl = await uploadFileToBucket(mainPhotoFile, userId, "main");
      }

      const galleryAUrls = [...formState.galleryA];
      const galleryBUrls = [...formState.galleryB];

      for (const item of galleryAUploads) {
        const uploadedUrl = await uploadFileToBucket(
          item.file,
          userId,
          "gallery_a",
        );
        galleryAUrls.push(uploadedUrl);
      }

      for (const item of galleryBUploads) {
        const uploadedUrl = await uploadFileToBucket(
          item.file,
          userId,
          "gallery_b",
        );
        galleryBUrls.push(uploadedUrl);
      }

      galleryAUploads.forEach((item) => {
        if (item.preview.startsWith("blob:")) {
          URL.revokeObjectURL(item.preview);
        }
      });
      galleryBUploads.forEach((item) => {
        if (item.preview.startsWith("blob:")) {
          URL.revokeObjectURL(item.preview);
        }
      });

      setGalleryAUploads([]);
      setGalleryBUploads([]);

      const ageValue = formState.age.trim()
        ? Number.parseInt(formState.age, 10)
        : null;

      if (ageValue !== null && Number.isNaN(ageValue)) {
        throw new Error("Usia harus berupa angka.");
      }

      const payload = {
        id: userId,
        name: formState.name.trim() || null,
        age: ageValue,
        city: formState.city.trim() || null,
        status: formState.status.trim() || null,
        pekerjaan: formState.pekerjaan.trim() || null,
        about: formState.about.trim() || null,
        interests: formState.interests,
        main_photo: mainPhotoUrl,
        gallery_a: galleryAUrls,
        gallery_b: galleryBUrls,
        updated_at: new Date().toISOString(),
      };

      console.log("[EditProfile] session.user", session.user);
      console.log("[EditProfile] upsert payload", payload);

      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "id" });

      if (upsertError) {
        throw new Error(upsertError.message);
      }

      setFormState((prev) => ({
        ...prev,
        mainPhoto: mainPhotoUrl,
        galleryA: galleryAUrls,
        galleryB: galleryBUrls,
      }));
      setMainPhotoFile(null);
      setMainPhotoPreview(null);
      setSuccess("Profil berhasil diperbarui.");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menyimpan profil.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/profile");
  };

  const renderGallerySection = (
    title: string,
    gallery: "a" | "b",
    existing: string[],
    uploads: PendingUpload[],
  ) => (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-neutral-700">{title}</h3>
        <span className="text-xs text-neutral-400">
          {existing.length + uploads.length} foto
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {existing.map((url) => (
          <div
            key={url}
            className={`relative h-28 w-28 overflow-hidden rounded-2xl border bg-neutral-50 shadow-inner ${inputShadow}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <button
              type="button"
              onClick={() => handleRemoveGalleryUrl(gallery, url)}
              className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-[2px] text-[10px] font-semibold text-white transition hover:bg-black/80"
            >
              Hapus
            </button>
          </div>
        ))}
        {uploads.map((item, index) => (
          <div
            key={item.preview}
            className={`relative h-28 w-28 overflow-hidden rounded-2xl border bg-neutral-50 shadow-inner ${inputShadow}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.preview}
              alt={`${title} baru`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemovePendingUpload(gallery, index)}
              className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-[2px] text-[10px] font-semibold text-white transition hover:bg-black/80"
            >
              Batal
            </button>
          </div>
        ))}
        <label
          className={`flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed text-xs text-neutral-400 transition ${inputBorder} ${
            loading || saving ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <span>Tambah</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            multiple
            onChange={handleGalleryChange(gallery)}
            disabled={loading || saving}
          />
        </label>
      </div>
    </div>
  );

  return (
    <section className="space-y-8">
      {error ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-medium text-rose-600 ${
            isPink ? "border-rose-200 bg-rose-50/80" : "border-rose-200 bg-rose-50"
          }`}
        >
          {error}
        </div>
      ) : null}

      {success ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-medium text-emerald-600 ${
            isPink
              ? "border-emerald-200 bg-emerald-50/80"
              : "border-emerald-200 bg-emerald-50"
          }`}
        >
          {success}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className={formClasses}>
        <div className="grid gap-6 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-neutral-600">
            Nama Lengkap
            <input
              type="text"
              value={formState.name}
              onChange={handleFieldChange("name")}
              placeholder="Nama panggilanmu"
              className={`rounded-2xl border bg-white px-4 py-3 text-sm text-neutral-700 shadow-inner ${inputShadow} focus:outline-none transition ${inputBorder}`}
              disabled={loading || saving}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-neutral-600">
            Kota
            <input
              type="text"
              value={formState.city}
              onChange={handleFieldChange("city")}
              placeholder="Domisili saat ini"
              className={`rounded-2xl border bg-white px-4 py-3 text-sm text-neutral-700 shadow-inner ${inputShadow} focus:outline-none transition ${inputBorder}`}
              disabled={loading || saving}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-neutral-600">
            Status
            <input
              type="text"
              value={formState.status}
              onChange={handleFieldChange("status")}
              placeholder="Single, fokus karier, dsb."
              className={`rounded-2xl border bg-white px-4 py-3 text-sm text-neutral-700 shadow-inner ${inputShadow} focus:outline-none transition ${inputBorder}`}
              disabled={loading || saving}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-neutral-600">
            Pekerjaan
            <input
              type="text"
              value={formState.pekerjaan}
              onChange={handleFieldChange("pekerjaan")}
              placeholder="Apa aktivitas utamamu saat ini?"
              className={`rounded-2xl border bg-white px-4 py-3 text-sm text-neutral-700 shadow-inner ${inputShadow} focus:outline-none transition ${inputBorder}`}
              disabled={loading || saving}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-neutral-600">
            Usia
            <input
              type="number"
              min={17}
              max={80}
              value={formState.age}
              onChange={handleFieldChange("age")}
              placeholder="Usia kamu"
              className={`rounded-2xl border bg-white px-4 py-3 text-sm text-neutral-700 shadow-inner ${inputShadow} focus:outline-none transition ${inputBorder}`}
              disabled={loading || saving}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-neutral-600 md:col-span-2">
            Tentang Kamu
            <textarea
              value={formState.about}
              onChange={handleFieldChange("about")}
              rows={4}
              placeholder="Ceritakan vibes terbaikmu di sini..."
              className={`resize-none rounded-2xl border bg-white px-4 py-3 text-sm text-neutral-700 shadow-inner ${inputShadow} focus:outline-none transition ${inputBorder}`}
              disabled={loading || saving}
            />
          </label>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-neutral-700">
              Interest Kamu
            </h3>
            <span className="text-xs text-neutral-400">
              {formState.interests.length} interest
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {formState.interests.map((interest) => (
              <span
                key={interest}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  isPink
                    ? "bg-[#ffeef5] text-rose-400"
                    : "bg-[#e3f1ff] text-sky-500"
                }`}
              >
                {interest}
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(interest)}
                  className={`rounded-full px-2 py-[2px] text-[10px] font-semibold transition ${
                    isPink
                      ? "bg-rose-200/40 text-rose-500 hover:bg-rose-200"
                      : "bg-sky-200/50 text-sky-600 hover:bg-sky-200"
                  }`}
                  aria-label={`Hapus interest ${interest}`}
                  disabled={loading || saving}
                >
                  x
                </button>
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={interestInput}
              onChange={(event) => setInterestInput(event.target.value)}
              placeholder="Tambah interest baru"
              maxLength={24}
              className={`flex-1 rounded-full border bg-white px-4 py-2 text-sm text-neutral-600 shadow-inner ${inputShadow} focus:outline-none transition ${inputBorder}`}
              disabled={loading || saving}
            />
            <button
              type="button"
              onClick={handleAddInterest}
              className={`rounded-full px-5 py-2 text-sm font-semibold text-white transition hover:brightness-105 ${
                isPink
                  ? "bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300 shadow-rose-200/70"
                  : "bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-600 shadow-sky-200/70"
              }`}
              disabled={loading || saving}
            >
              Tambah
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-neutral-700">
              Foto Profil Utama
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              <div
                className={`relative h-32 w-32 overflow-hidden rounded-3xl border bg-neutral-50 shadow-inner ${inputShadow}`}
              >
                {mainPhotoPreview || formState.mainPhoto ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={mainPhotoPreview ?? formState.mainPhoto ?? ""}
                    alt="Foto profil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                    Belum ada foto
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3 text-xs text-neutral-500">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 font-semibold transition hover:bg-neutral-100">
                  Unggah Foto
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleMainPhotoChange}
                    disabled={loading || saving}
                  />
                </label>
                {(formState.mainPhoto || mainPhotoPreview) && (
                  <button
                    type="button"
                    onClick={handleRemoveMainPhoto}
                    className="self-start rounded-full border px-4 py-2 font-semibold text-neutral-500 transition hover:bg-neutral-100"
                    disabled={loading || saving}
                  >
                    Hapus Foto
                  </button>
                )}
                <span>Maksimal 5MB, sebaiknya rasio persegi.</span>
              </div>
            </div>
          </div>

          {renderGallerySection(
            "Foto Gallery",
            "a",
            formState.galleryA,
            galleryAUploads,
          )}

          {renderGallerySection(
            "Foto Moments",
            "b",
            formState.galleryB,
            galleryBUploads,
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className={`rounded-full border px-6 py-2 text-sm font-semibold text-neutral-500 transition hover:bg-neutral-100 ${
              isPink
                ? "hover:border-rose-200 hover:text-rose-500"
                : "hover:border-sky-300 hover:text-sky-500"
            }`}
            disabled={saving}
          >
            Batal
          </button>
          <button type="submit" className={submitButtonClasses} disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-center text-sm text-neutral-400">
          Memuat data profil...
        </p>
      ) : null}
    </section>
  );
}
