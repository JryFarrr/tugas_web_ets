"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { DashboardShell, useDashboardTheme } from "@/components/DashboardShell";
import { supabase } from "@/lib/supabaseClient";

type ConversationSummary = {
  id: string;
  partner: {
    id: string;
    name: string | null;
    age: number | null;
    city: string | null;
    pekerjaan: string | null;
    about: string | null;
    photoUrl: string | null;
  };
  compatibility: number;
  stage: string;
  createdAt: string | null;
  lastMessage: { senderId: string; content: string; createdAt: string } | null;
};

type ChatMessage = {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  fromMe: boolean;
};

export default function MessagesPage() {
  return (
    <DashboardShell
      headerChips={[]}
      headerShowSearch={false}
      headerSubtitle="Pesan"
      headerHeadline="Obrolan hangat dengan kecocokanmu"
      headerStatusBadge="Menghubungkan percakapan..."
    >
      <MessagesContent />
    </DashboardShell>
  );
}

function MessagesContent() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [conversationsError, setConversationsError] = useState<string | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [messageDraft, setMessageDraft] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const { themeName } = useDashboardTheme();
  const isPink = themeName === "pink";

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setCurrentUserId(data.session?.user.id ?? null);
      }
    });
    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUserId(session?.user.id ?? null);
    });
    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchConversations = useCallback(async () => {
    setLoadingConversations(true);
    setConversationsError(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        setConversations([]);
        setConversationsError("Sesi tidak ditemukan. Silakan login kembali.");
        return;
      }

      const response = await fetch("/api/messages/conversations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message ?? "Gagal memuat percakapan.");
      }

      const body = (await response.json()) as { conversations: ConversationSummary[] };
      setConversations(body.conversations ?? []);
    } catch (err) {
      setConversationsError(
        err instanceof Error ? err.message : "Gagal memuat percakapan.",
      );
      setConversations([]);
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  useEffect(() => {
    void fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (!conversations.length) {
      setSelectedId(null);
      return;
    }
    const chatParam = searchParams.get("chat");
    if (chatParam && conversations.some((conversation) => conversation.id === chatParam)) {
      setSelectedId(chatParam);
      return;
    }
    setSelectedId((prev) => prev ?? conversations[0]?.id ?? null);
  }, [conversations, searchParams]);

  const loadMessages = useCallback(
    async (conversationId: string) => {
      setLoadingMessages(true);
      setMessagesError(null);
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("id, sender_id, content, created_at")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });

        if (error) {
          throw new Error(error.message);
        }

        const result =
          data?.map((row) => ({
            id: row.id,
            senderId: row.sender_id,
            content: row.content,
            createdAt: row.created_at,
            fromMe: currentUserId ? row.sender_id === currentUserId : false,
          })) ?? [];

        setMessages(result);
      } catch (err) {
        setMessagesError(
          err instanceof Error ? err.message : "Gagal memuat pesan.",
        );
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    },
    [currentUserId],
  );

  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }
    void loadMessages(selectedId);
  }, [selectedId, loadMessages]);

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    const channel = supabase
      .channel(`messages-${selectedId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedId}`,
        },
        (payload) => {
          const newRow = payload.new as {
            id: string;
            sender_id: string;
            content: string;
            created_at: string;
            conversation_id: string;
          };
          setMessages((prev) => {
            if (prev.some((message) => message.id === newRow.id)) {
              return prev;
            }
            return [
              ...prev,
              {
                id: newRow.id,
                senderId: newRow.sender_id,
                content: newRow.content,
                createdAt: newRow.created_at,
                fromMe: currentUserId ? newRow.sender_id === currentUserId : false,
              },
            ];
          });
          setConversations((prev) =>
            prev.map((conversation) =>
              conversation.id === newRow.conversation_id
                ? {
                    ...conversation,
                    lastMessage: {
                      senderId: newRow.sender_id,
                      content: newRow.content,
                      createdAt: newRow.created_at,
                    },
                  }
                : conversation,
            ),
          );
        },
      )
      .subscribe();

  return () => {
      void supabase.removeChannel(channel);
    };
  }, [selectedId, currentUserId]);

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedId,
  ) ?? null;

  const styles = useMemo(
    () =>
      isPink
        ? {
            infoCard:
              "rounded-[32px] border border-white/70 bg-gradient-to-br from-[#fff6fc] via-white to-[#ffe9f4] p-6 shadow-[0_45px_110px_rgba(249,115,164,0.16)] backdrop-blur transition-colors duration-500",
            listCard:
              "rounded-[24px] border border-white/70 bg-gradient-to-br from-[#fff6fc] via-white to-[#ffe9f4] shadow-[0_35px_90px_rgba(249,115,164,0.15)]",
            chatCard:
              "rounded-[24px] border border-white/70 bg-gradient-to-br from-[#fff6fc] via-white to-[#ffe9f4] shadow-[0_35px_90px_rgba(249,115,164,0.18)]",
            activeItem: "bg-[#ffeef5] text-rose-500",
            inactiveItem: "hover:bg-[#ffeef5]/50 text-neutral-500",
            meBubble: "bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300 text-white",
            matchBubble: "bg-white/70 text-neutral-700 border border-white/60",
            sendButton:
              "bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300 text-white h-10 px-4 rounded-xl font-semibold shadow-rose-200/70 transition hover:brightness-110",
          }
        : {
            infoCard:
              "rounded-[32px] border border-white/70 bg-gradient-to-br from-[#e3f1ff] via-white to-[#d9e8ff] p-6 shadow-[0_45px_110px_rgba(79,70,229,0.18)] backdrop-blur transition-colors duration-500",
            listCard:
              "rounded-[24px] border border-white/70 bg-gradient-to-br from-[#e7f2ff] via-white to-[#d8e8ff] shadow-[0_35px_90px_rgba(79,70,229,0.14)]",
            chatCard:
              "rounded-[24px] border border-white/70 bg-gradient-to-br from-[#e7f2ff] via-white to-[#d8e8ff] shadow-[0_35px_90px_rgba(79,70,229,0.18)]",
            activeItem: "bg-[#e5f2ff] text-sky-500",
            inactiveItem: "hover:bg-[#e5f2ff]/50 text-neutral-500",
            meBubble: "bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-600 text-white",
            matchBubble: "bg-white/70 text-neutral-700 border border-white/60",
            sendButton:
              "bg-gradient-to-r from-sky-500 via-indigo-500 to-blue-600 text-white h-10 px-4 rounded-xl font-semibold shadow-sky-200/70 transition hover:brightness-110",
          },
    [isPink],
  );

  const handleSendMessage = useCallback(async () => {
    const trimmed = messageDraft.trim();
    if (!selectedConversation || !trimmed || !currentUserId) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: currentUserId,
          content: trimmed,
        })
        .select("id, sender_id, content, created_at")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setMessages((prev) => [
          ...prev,
          {
            id: data.id,
            senderId: data.sender_id,
            content: data.content,
            createdAt: data.created_at,
            fromMe: true,
          },
        ]);
        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.id === selectedConversation.id
              ? {
                  ...conversation,
                  lastMessage: {
                    senderId: currentUserId,
                    content: trimmed,
                    createdAt: data.created_at,
                  },
                }
              : conversation,
          ),
        );
      }
      setMessageDraft("");
      setMessagesError(null);
    } catch (err) {
      setMessagesError(
        err instanceof Error ? err.message : "Tidak dapat mengirim pesan.",
      );
    }
  }, [messageDraft, selectedConversation, currentUserId]);

  const headerBadge = useMemo(() => {
    if (loadingConversations) {
      return "Memuat percakapan...";
    }
    if (conversationsError) {
      return "Gagal memuat percakapan";
    }
    return `${conversations.length} percakapan aktif`;
  }, [loadingConversations, conversationsError, conversations.length]);

  return (
    <section className="space-y-6">
      <div className={styles.infoCard}>
        <h2 className="text-xl font-semibold text-neutral-900">
          Obrolanmu dengan pasangan SoulMatch
        </h2>
        <p className="mt-2 text-sm text-neutral-500">
          Pilih kandidat di sebelah kiri untuk melanjutkan percakapan. Semua pesan
          ditampilkan secara realtime begitu kamu dan match-mu mengirim pesan baru.
        </p>
      </div>

      {conversationsError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-6 text-sm text-rose-500">
          {conversationsError}
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className={`${styles.listCard} p-4`}>
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
              Daftar obrolan
            </h3>
            <span className="text-xs font-semibold text-neutral-400">
              {headerBadge}
            </span>
          </div>

          {loadingConversations ? (
            <ul className="mt-4 space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <li
                  key={index}
                  className="h-16 animate-pulse rounded-2xl bg-white/60"
                />
              ))}
            </ul>
          ) : conversations.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/60 p-6 text-center text-sm text-neutral-500">
              Belum ada percakapan. Buka halaman kecocokan dan klik tombol <strong>Sapa</strong>
              untuk memulai obrolan baru.
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {conversations.map((conversation) => {
                const lastMessage = conversation.lastMessage;
                const isActive = conversation.id === selectedId;
                return (
                  <li key={conversation.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(conversation.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                        isActive ? styles.activeItem : styles.inactiveItem
                      }`}
                    >
                      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-neutral-200">
                        {conversation.partner.photoUrl ? (
                          <Image
                            src={conversation.partner.photoUrl}
                            alt={conversation.partner.name ?? "Pengguna"}
                            fill
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-neutral-800">
                          {conversation.partner.name ?? "Pengguna SoulMatch"}
                        </p>
                        <p className="truncate text-xs text-neutral-500">
                          {lastMessage ? lastMessage.content : "Belum ada pesan."}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-emerald-500">
                        {conversation.compatibility}%
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        <div className={`${styles.chatCard} flex min-h-[480px] flex-col p-6`}>
          {selectedConversation ? (
            <>
              <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/70 pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-neutral-200">
                    {selectedConversation.partner.photoUrl ? (
                      <Image
                        src={selectedConversation.partner.photoUrl}
                        alt={selectedConversation.partner.name ?? "Pengguna"}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {selectedConversation.partner.name ?? "Pengguna SoulMatch"}
                      {selectedConversation.partner.age
                        ? `, ${selectedConversation.partner.age}`
                        : ""}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      {selectedConversation.partner.city ?? "Lokasi tak diketahui"}
                      {selectedConversation.partner.pekerjaan
                        ? ` • ${selectedConversation.partner.pekerjaan}`
                        : ""}
                    </p>
                    <p className="text-xs text-emerald-500">
                      {selectedConversation.compatibility}% cocok
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 text-xs text-neutral-500">
                  <Link
                    href={selectedConversation.partner.id
                      ? `https://wa.me/${selectedConversation.partner.id}`
                      : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-300/60 px-3 py-2 font-semibold text-emerald-500 transition hover:bg-emerald-500/10"
                  >
                    Kontak WA
                  </Link>
                  {selectedConversation.partner.about ? (
                    <p className="max-w-xs text-right text-neutral-400">
                      “{selectedConversation.partner.about}”
                    </p>
                  ) : null}
                </div>
              </header>

              <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-1">
                {loadingMessages ? (
                  <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                    Memuat pesan...
                  </div>
                ) : messagesError ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-500">
                    {messagesError}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-neutral-400">
                    <p>Belum ada percakapan dengan {selectedConversation.partner.name ?? "match"}.</p>
                    <p className="text-xs">
                      Mulai obrolan pertamamu di bawah ini.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.fromMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow transition ${
                          message.fromMe ? styles.meBubble : styles.matchBubble
                        }`}
                      >
                        <p>{message.content}</p>
                        <span className="mt-2 block text-[10px] opacity-70">
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSendMessage();
                }}
                className="mt-4 flex items-center gap-3 border-t border-white/60 pt-4"
              >
                <input
                  value={messageDraft}
                  onChange={(event) => setMessageDraft(event.target.value)}
                  placeholder="Ketik pesan hangat..."
                  className="flex-1 rounded-xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200/70"
                />
                <button type="submit" className={styles.sendButton}>
                  Kirim
                </button>
              </form>
            </>
          ) : loadingConversations ? (
            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
              Memuat percakapan...
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-neutral-400">
              <p>Belum ada percakapan yang dipilih.</p>
              <p className="text-xs">
                Pilih kandidat di sisi kiri atau kembali ke halaman kecocokan
                untuk memulai obrolan baru.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
