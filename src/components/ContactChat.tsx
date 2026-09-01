"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, Send } from "lucide-react";

import {
  customerReplyToMessage,
  getMyContactMessages,
} from "@/services/contact.service";

export default function ContactChat() {
  const queryClient = useQueryClient();

  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null,
  );

  const [replyText, setReplyText] = useState("");

  // ============================================================
  // GET CUSTOMER CONVERSATIONS
  // ============================================================

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-contact-messages"],
    queryFn: getMyContactMessages,
  });

  const conversations = data?.data ?? [];

  // ============================================================
  // SELECT FIRST CONVERSATION
  // ============================================================

  useEffect(() => {
    if (conversations.length > 0 && !selectedMessageId) {
      setSelectedMessageId(conversations[0]._id);
    }
  }, [conversations, selectedMessageId]);

  const selectedConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation._id === selectedMessageId,
      ),
    [conversations, selectedMessageId],
  );

  // ============================================================
  // CUSTOMER REPLY
  // ============================================================

  const replyMutation = useMutation({
    mutationFn: ({ id, reply }: { id: string; reply: string }) =>
      customerReplyToMessage(id, reply),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-contact-messages"],
      });

      setReplyText("");
    },
  });

  // ============================================================
  // SELECT CONVERSATION
  // ============================================================

  function handleSelectConversation(id: string) {
    setSelectedMessageId(id);
    setReplyText("");
  }

  // ============================================================
  // SEND REPLY
  // ============================================================

  function handleSendReply() {
    if (!selectedConversation || !replyText.trim()) {
      return;
    }

    replyMutation.mutate({
      id: selectedConversation._id,
      reply: replyText.trim(),
    });
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading) {
    return (
      <div className="rounded-xl border border-beige bg-white p-8">
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-gray">Loading your messages...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (isError) {
    return (
      <div className="rounded-xl border border-beige bg-white p-8">
        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-red-500">Could not load your messages.</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // NO CONVERSATIONS
  // ============================================================

  if (conversations.length === 0) {
    return (
      <div className="rounded-xl border border-beige bg-white p-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <MessageCircle className="mb-4 h-10 w-10 text-gray" />

          <h2 className="font-serif text-2xl text-black">No messages yet</h2>

          <p className="mt-2 max-w-md text-sm text-gray">
            You don't have any conversations with our support team yet.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // CHAT
  // ============================================================

  return (
    <div className="grid min-h-[650px] overflow-hidden rounded-2xl border border-beige bg-white shadow-sm lg:grid-cols-[300px_1fr]">
      {/* ======================================================== */}
      {/* CONVERSATIONS SIDEBAR */}
      {/* ======================================================== */}

      <div className="border-b border-beige lg:border-r lg:border-b-0">
        {/* Sidebar header */}

        <div className="border-b border-beige bg-cream/50 px-5 py-4">
          <h2 className="font-medium text-black">My Conversations</h2>

          <p className="mt-1 text-xs text-gray">
            {conversations.length}{" "}
            {conversations.length === 1 ? "conversation" : "conversations"}
          </p>
        </div>

        {/* Conversation list */}

        <div className="max-h-[250px] overflow-y-auto lg:max-h-[600px]">
          {conversations.map((conversation) => {
            const isSelected = conversation._id === selectedMessageId;

            const lastMessage =
              conversation.messages[conversation.messages.length - 1];

            return (
              <button
                key={conversation._id}
                type="button"
                onClick={() => handleSelectConversation(conversation._id)}
                className={`w-full border-b border-beige px-4 py-4 text-left transition ${
                  isSelected ? "bg-beige/60" : "hover:bg-cream"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-medium text-white">
                    {conversation.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Conversation information */}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-black">
                      {conversation.subject}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray">
                      {lastMessage?.message ?? ""}
                    </p>

                    {lastMessage && (
                      <p className="mt-1 text-[10px] text-gray">
                        {new Date(lastMessage.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* CHAT */}
      {/* ======================================================== */}

      <div className="flex min-h-[600px] flex-col">
        {selectedConversation ? (
          <>
            {/* ================================================== */}
            {/* CHAT HEADER */}
            {/* ================================================== */}

            <div className="border-b border-beige bg-white px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-sm font-medium text-white">
                  {selectedConversation.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="font-medium text-black">FITTED Support</p>

                  <p className="text-xs text-gray">
                    {selectedConversation.subject}
                  </p>
                </div>
              </div>
            </div>

            {/* ================================================== */}
            {/* CHAT BODY */}
            {/* ================================================== */}

            <div className="flex flex-1 flex-col gap-5 overflow-y-auto bg-cream/30 p-5 md:p-8">
              {/* Subject */}

              <div className="text-center">
                <span className="rounded-full bg-beige px-3 py-1 text-xs text-gold-dark">
                  {selectedConversation.subject}
                </span>
              </div>

              {/* Messages */}

              {selectedConversation.messages.map((chatMessage, index) => {
                const isCustomer = chatMessage.sender === "customer";

                return (
                  <div
                    key={chatMessage._id ?? `${chatMessage.createdAt}-${index}`}
                    className={`flex ${
                      isCustomer ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="max-w-[80%] md:max-w-[65%]">
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-sm ${
                          isCustomer
                            ? "rounded-tr-sm bg-gold"
                            : "rounded-tl-sm border border-beige bg-white"
                        }`}
                      >
                        {!isCustomer && (
                          <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-gold-dark">
                            FITTED Support
                          </p>
                        )}

                        {isCustomer && (
                          <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-white/70">
                            You
                          </p>
                        )}

                        <p
                          className={`whitespace-pre-wrap text-sm leading-relaxed ${
                            isCustomer ? "text-white" : "text-black"
                          }`}
                        >
                          {chatMessage.message}
                        </p>
                      </div>

                      <p
                        className={`mt-1 px-1 text-[10px] text-gray ${
                          isCustomer ? "text-right" : "text-left"
                        }`}
                      >
                        {new Date(chatMessage.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ================================================== */}
            {/* REPLY BOX */}
            {/* ================================================== */}

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
                  placeholder="Write a message..."
                  disabled={replyMutation.isPending}
                  className="min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-black outline-none placeholder:text-gray disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={handleSendReply}
                  disabled={replyMutation.isPending || !replyText.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold text-white transition hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
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
  );
}
