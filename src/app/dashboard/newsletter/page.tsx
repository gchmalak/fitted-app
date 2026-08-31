"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  sendBroadcast,
  getAllSubscribers,
} from "@/services/newsletter.service";
import BreadCrumbs from "@/components/BreadCrumbs";

export default function AdminNewsletterPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const { data: subscribersData, isLoading: isLoadingSubscribers } = useQuery({
    queryKey: ["newsletter", "subscribers"],
    queryFn: getAllSubscribers,
  });
  const subscriberCount = subscribersData?.data.length ?? 0;

  const { mutate, isPending, data, isError, error } = useMutation({
    mutationFn: () => sendBroadcast(subject, message),
    onSuccess: () => {
      setSubject("");
      setMessage("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    if (
      !confirm(
        `Send this to all ${subscriberCount} subscribers? This can't be undone.`,
      )
    )
      return;
    mutate();
  };

  return (
    <div className="p-6 md:p-10">
      {/* Bread crumbs */}
      <BreadCrumbs
        items={[
          {
            label: "Newsletter",
            href: "/dashboard/newsletter",
          },
        ]}
      />
      {/* heading */}
      <h1 className="mb-2 font-serif text-3xl text-black">Send Newsletter</h1>
      {/* subscribers count */}
      <p className="mb-8 text-sm text-gray">
        {isLoadingSubscribers ? (
          "Loading subscriber count..."
        ) : (
          <>
            <span className="font-medium text-gold-dark">
              {subscriberCount}
            </span>{" "}
            subscriber{subscriberCount !== 1 ? "s" : ""} will receive this
            email.
          </>
        )}
      </p>
      {/* newsletter submit form */}
      <form
        onSubmit={handleSubmit}
        className="flex max-w-xl flex-col gap-4 rounded-2xl border border-beige bg-white p-8"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-black">Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. New Arrivals This Week"
            required
            className="rounded-md border border-beige bg-cream px-4 py-2 text-black outline-none focus:border-gold"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-black">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            required
            className="resize-none rounded-md border border-beige bg-cream px-4 py-2 text-black outline-none focus:border-gold"
          />
        </div>

        {isError && <p className="text-sm text-red-500">{error.message}</p>}
        {data && (
          <p className="text-sm text-green-600">
            Sent to {data.data.sent} of {data.data.total} subscribers
            {data.data.failed > 0 && ` (${data.data.failed} failed)`}.
          </p>
        )}

        <button
          type="submit"
          disabled={isPending || subscriberCount === 0}
          className="mt-2 rounded-md bg-gold px-6 py-3 font-medium text-white hover:bg-gold-dark disabled:opacity-60"
        >
          {isPending
            ? "Sending..."
            : subscriberCount === 0
              ? "No Subscribers Yet"
              : "Send to All Subscribers"}
        </button>
      </form>
    </div>
  );
}
