"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllContactMessages,
  markContactMessageRead,
  replyToMessage,
} from "@/services/contact.service";
import BreadCrumbs from "@/components/BreadCrumbs";
import { CheckCheck, MessageCircle, Send } from "lucide-react";

export default function AdminMessagesPage() {
  const queryClient = useQueryClient();

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null,
  );

  const [replyText, setReplyText] = useState("");

  // Get messages
  const { data, isLoading, isError } = useQuery({
    queryKey: ["contact-messages"],
    queryFn: getAllContactMessages,
  });

  const messages = data?.data ?? [];

  // Automatically select the first message
  useEffect(() => {
    if (messages.length > 0 && !selectedMessageId) {
      setSelectedMessageId(messages[0]._id);
    }
  }, [messages, selectedMessageId]);

  const selectedMessage = useMemo(
    () => messages.find((msg) => msg._id === selectedMessageId),
    [messages, selectedMessageId],
  );

  // Mark as read
  const readMutation = useMutation({
    mutationFn: markContactMessageRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contact-messages"],
      });
    },
  });

  // Reply
  const replyMutation = useMutation({
    mutationFn: ({ id, reply }: { id: string; reply: string }) =>
      replyToMessage(id, reply),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contact-messages"],
      });

      setReplyText("");
    },
  });

  // Select conversation
  const handleSelectMessage = (id: string) => {
    setSelectedMessageId(id);

    const message = messages.find((msg) => msg._id === id);

    if (message && !message.isRead) {
      readMutation.mutate(id);
    }

    // Clear reply box when switching conversations
    setReplyText("");
  };

  // Send reply
  const handleSendReply = () => {
    if (!selectedMessage || !replyText.trim()) return;

    replyMutation.mutate({
      id: selectedMessage._id,
      reply: replyText.trim(),
    });
  };

  if (isLoading) {
    return <div className="p-10 text-gray">Loading messages...</div>;
  }

  if (isError) {
    return <div className="p-10 text-gray">Failed to load messages.</div>;
  }

  return (
    <div className="p-6 md:p-10">
      {/* Breadcrumbs */}
      <BreadCrumbs
        items={[
          {
            label: "Messages",
            href: "/dashboard/messages",
          },
        ]}
      />

      {/* Heading */}
      <div className="mb-6 flex items-center gap-3">
        <MessageCircle className="h-6 w-6 text-gold-dark" />

        <h1 className="font-serif text-3xl text-black">Messages</h1>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-xl border border-beige bg-white py-20 text-center">
          <MessageCircle className="mx-auto mb-3 h-10 w-10 text-gray" />

          <p className="text-gray">No messages yet.</p>
        </div>
      ) : (
        <div className="grid min-h-[650px] overflow-hidden rounded-2xl border border-beige bg-white shadow-sm lg:grid-cols-[300px_1fr]">
          {/* ================================================================= */}
          {/* CONVERSATIONS SIDEBAR */}
          {/* ================================================================= */}

          <div className="border-b border-beige lg:border-r lg:border-b-0">
            {/* Sidebar header */}
            <div className="border-b border-beige bg-cream/50 px-5 py-4">
              <div className="flex items-center justify-between">
                <h2 className="font-medium text-black">Conversations</h2>

                <span className="rounded-full bg-gold px-2.5 py-1 text-xs text-white">
                  {messages.filter((msg) => !msg.isRead).length}
                </span>
              </div>
            </div>

            {/* Conversations */}
            <div className="max-h-[250px] overflow-y-auto lg:max-h-[600px]">
              {messages.map((msg) => {
                const isSelected = msg._id === selectedMessageId;

                return (
                  <button
                    key={msg._id}
                    type="button"
                    onClick={() => handleSelectMessage(msg._id)}
                    className={`w-full border-b border-beige px-4 py-4 text-left transition ${
                      isSelected ? "bg-beige/60" : "hover:bg-cream"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-medium text-white">
                        {msg.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={`truncate text-sm ${
                              msg.isRead
                                ? "font-medium text-black"
                                : "font-semibold text-black"
                            }`}
                          >
                            {msg.name}
                          </p>

                          {!msg.isRead && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-gold" />
                          )}
                        </div>

                        <p className="mt-0.5 truncate text-xs text-gold-dark">
                          {msg.subject}
                        </p>

                        <p className="mt-1 truncate text-xs text-gray">
                          {msg.message}
                        </p>

                        <p className="mt-1 text-[10px] text-gray">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ================================================================= */}
          {/* CHAT */}
          {/* ================================================================= */}

          <div className="flex min-h-[600px] flex-col">
            {selectedMessage ? (
              <>
                {/* ========================================================= */}
                {/* CHAT HEADER */}
                {/* ========================================================= */}

                <div className="flex items-center justify-between border-b border-beige bg-white px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-sm font-medium text-white">
                      {selectedMessage.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-medium text-black">
                        {selectedMessage.name}
                      </p>

                      <p className="text-xs text-gray">
                        {selectedMessage.email}
                      </p>
                    </div>
                  </div>

                  {!selectedMessage.isRead && (
                    <button
                      type="button"
                      onClick={() => readMutation.mutate(selectedMessage._id)}
                      disabled={readMutation.isPending}
                      className="flex items-center gap-2 rounded-md border border-beige px-3 py-1.5 text-xs text-gray transition hover:bg-beige disabled:opacity-50"
                    >
                      <CheckCheck className="h-4 w-4" />
                      Mark as read
                    </button>
                  )}
                </div>

                {/* ========================================================= */}
                {/* CHAT BODY */}
                {/* ========================================================= */}

                <div className="flex flex-1 flex-col gap-5 overflow-y-auto bg-cream/30 p-5 md:p-8">
                  {/* Subject */}
                  <div className="text-center">
                    <span className="rounded-full bg-beige px-3 py-1 text-xs text-gold-dark">
                      {selectedMessage.subject}
                    </span>
                  </div>

                  {/* User message */}
                  <div className="flex justify-start">
                    <div className="max-w-[80%] md:max-w-[65%]">
                      <div className="rounded-2xl rounded-tl-sm border border-beige bg-white px-4 py-3 shadow-sm">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-black">
                          {selectedMessage.message}
                        </p>
                      </div>

                      <p className="mt-1 px-1 text-[10px] text-gray">
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Admin reply */}
                  {selectedMessage.reply && (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] md:max-w-[65%]">
                        <div className="rounded-2xl rounded-tr-sm bg-gold px-4 py-3 shadow-sm">
                          <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-white/70">
                            You
                          </p>

                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-white">
                            {selectedMessage.reply}
                          </p>
                        </div>

                        <p className="mt-1 px-1 text-right text-[10px] text-gray">
                          Reply sent
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Empty space if no reply */}
                  {!selectedMessage.reply && (
                    <div className="mt-auto text-center">
                      <p className="text-xs text-gray">
                        Reply to this message below.
                      </p>
                    </div>
                  )}
                </div>

                {/* ========================================================= */}
                {/* REPLY BOX */}
                {/* ========================================================= */}

                <div className="border-t border-beige bg-white p-4">
                  <div className="flex items-end gap-3 rounded-xl border border-beige bg-cream p-2 focus-within:border-gold">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply();
                        }
                      }}
                      rows={2}
                      placeholder="Write your reply..."
                      className="min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-black outline-none placeholder:text-gray"
                    />

                    <button
                      type="button"
                      onClick={handleSendReply}
                      disabled={replyMutation.isPending || !replyText.trim()}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold text-white transition hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Send reply"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="mt-2 px-1 text-[10px] text-gray">
                    Press Enter to send · Shift + Enter for a new line
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-gray">
                <div className="text-center">
                  <MessageCircle className="mx-auto mb-3 h-10 w-10" />

                  <p className="text-sm">Select a conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
