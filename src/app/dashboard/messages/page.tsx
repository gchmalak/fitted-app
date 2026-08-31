"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllContactMessages,
  markContactMessageRead,
  replyToMessage,
} from "@/services/contact.service";
import BreadCrumbs from "@/components/BreadCrumbs";

export default function AdminMessagesPage() {
  // useQueryClient_____________________________________________________________________________________
  const queryClient = useQueryClient();
  //states______________________________________________________________________________________________
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [openReplyFor, setOpenReplyFor] = useState<string | null>(null);
  // useQuery___________________________________________________________________________________________
  const { data, isLoading } = useQuery({
    queryKey: ["contact-messages"],
    queryFn: getAllContactMessages,
  });

  // useMutation___________________________________________________________________________________________
  const readMutation = useMutation({
    mutationFn: markContactMessageRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] }),
  });

  const replyMutation = useMutation({
    mutationFn: ({ id, reply }: { id: string; reply: string }) =>
      replyToMessage(id, reply),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      setReplyText((prev) => ({ ...prev, [variables.id]: "" }));
      setOpenReplyFor(null);
    },
  });

  const messages = data?.data ?? [];
  // Loading message
  if (isLoading) return <p className="p-10 text-gray">Loading messages...</p>;

  return (
    <div className="p-6 md:p-10">
      {/* Bread crumbs */}
      <BreadCrumbs
        items={[
          {
            label: "Messages",
            href: "/dashboard/messages",
          },
        ]}
      />
      {/* heading */}
      <h1 className="mb-8 font-serif text-3xl text-black">Contact Messages</h1>
      {/* No messages yet message */}
      {messages.length === 0 ? (
        <p className="rounded-xl border border-beige bg-white py-16 text-center text-gray">
          No messages yet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`rounded-xl border p-5 ${
                msg.isRead ? "border-beige bg-white" : "border-gold bg-beige/40"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium text-black">
                    {msg.name}{" "}
                    <span className="font-normal text-gray">({msg.email})</span>
                  </p>
                  <p className="mt-1 text-sm font-medium text-gold-dark">
                    {msg.subject}
                  </p>
                  <p className="mt-2 text-sm text-gray">{msg.message}</p>
                  <p className="mt-2 text-xs text-gray">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                  {/* replying to the message */}
                  {msg.reply && (
                    <div className="mt-3 rounded-md bg-cream p-3">
                      <p className="text-xs font-medium text-gold-dark">
                        Your reply:
                      </p>
                      <p className="mt-1 text-sm text-black">{msg.reply}</p>
                    </div>
                  )}

                  {openReplyFor === msg._id && (
                    <div className="mt-3 flex flex-col gap-2">
                      <textarea
                        value={replyText[msg._id] ?? ""}
                        onChange={(e) =>
                          setReplyText((prev) => ({
                            ...prev,
                            [msg._id]: e.target.value,
                          }))
                        }
                        rows={3}
                        placeholder="Write your reply..."
                        className="rounded-md border border-beige bg-white px-3 py-2 text-sm text-black outline-none focus:border-gold"
                      />
                      {/* pending */}
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            replyMutation.mutate({
                              id: msg._id,
                              reply: replyText[msg._id] ?? "",
                            })
                          }
                          disabled={
                            replyMutation.isPending ||
                            !replyText[msg._id]?.trim()
                          }
                          className="rounded-md bg-gold px-4 py-1.5 text-xs font-medium text-white hover:bg-gold-dark disabled:opacity-50"
                        >
                          {replyMutation.isPending
                            ? "Sending..."
                            : "Send Reply"}
                        </button>
                        <button
                          onClick={() => setOpenReplyFor(null)}
                          className="rounded-md border border-beige px-4 py-1.5 text-xs text-gray hover:bg-beige"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {/* mark as read  */}
                <div className="flex shrink-0 flex-col gap-2">
                  {!msg.isRead && (
                    <button
                      onClick={() => readMutation.mutate(msg._id)}
                      disabled={readMutation.isPending}
                      className="rounded-md border border-gold px-3 py-1.5 text-xs text-gold-dark hover:bg-beige disabled:opacity-50"
                    >
                      Mark as Read
                    </button>
                  )}
                  {/* reply button */}
                  {openReplyFor !== msg._id && !msg.reply && (
                    <button
                      onClick={() => setOpenReplyFor(msg._id)}
                      className="rounded-md bg-gold px-3 py-1.5 text-xs font-medium text-white hover:bg-gold-dark"
                    >
                      Reply
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
