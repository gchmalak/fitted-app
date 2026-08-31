"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { sendContactMessage } from "@/services/contact.service";
import Link from "next/link";

export default function ContactPage() {
  const { mutate, isPending, isSuccess, error, isError } = useMutation({
    mutationFn: sendContactMessage,
  });

  const form = useForm({
    defaultValues: { name: "", email: "", subject: "", message: "" },
    onSubmit: async ({ value, formApi }) => {
      mutate(value, {
        onSuccess: () => formApi.reset(),
      });
    },
  });

  return (
    <section className="bg-cream px-6 py-16 md:px-16">
      <Link
        href="/"
        className="mb-8 inline-block text-sm text-gold-dark hover:text-gold"
      >
        ← Back to Home
      </Link>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <span className="text-sm uppercase tracking-wide text-gold-dark">
            Get In Touch
          </span>
          <h1 className="mt-2 font-serif text-4xl text-black">Contact Us</h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-gray">
            Have a question about an order, a product, or anything else? Send us
            a message and we'll get back to you within 1–2 business days.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4 rounded-2xl border border-beige bg-white p-8"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.Field name="name">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-black">Name</label>
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                    className="rounded-md border border-beige bg-cream px-4 py-2 text-black outline-none focus:border-gold"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-black">
                    Email
                  </label>
                  <input
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                    className="rounded-md border border-beige bg-cream px-4 py-2 text-black outline-none focus:border-gold"
                  />
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="subject">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-black">
                  Subject
                </label>
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                  className="rounded-md border border-beige bg-cream px-4 py-2 text-black outline-none focus:border-gold"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="message">
            {(field) => (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-black">
                  Message
                </label>
                <textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={5}
                  required
                  className="resize-none rounded-md border border-beige bg-cream px-4 py-2 text-black outline-none focus:border-gold"
                />
              </div>
            )}
          </form.Field>

          {isError && <p className="text-sm text-red-500">{error.message}</p>}
          {isSuccess && (
            <p className="text-sm text-green-600">
              Message sent — we'll be in touch soon.
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 rounded-md bg-gold px-6 py-3 font-medium text-white transition hover:bg-gold-dark disabled:opacity-60"
          >
            {isPending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}
