"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/services/auth.service";
import { forgotPasswordSchema } from "@/lib/validation/auth";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[issue.path[0] as string] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await forgotPassword(result.data.email);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-beige bg-white p-8 shadow-sm">
      <h1 className="font-serif text-3xl text-black">Reset your password</h1>

      {submitted ? (
        <div className="mt-6 flex flex-col gap-4">
          <p className="text-sm text-gray">
            If an account exists for <span className="text-black">{email}</span>
            , a password reset link has been sent. Check your inbox.
          </p>
          <Link
            href="/login"
            className="text-sm text-gold-dark hover:text-gold"
          >
            ← Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border border-beige bg-white px-4 py-2 text-black focus:border-gold outline-none"
            />
            {fieldErrors.email && (
              <p className="text-xs text-gold-dark">{fieldErrors.email}</p>
            )}
          </div>

          {error && <p className="text-sm text-gold-dark">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-gold px-6 py-3 font-medium text-white transition hover:bg-gold-dark disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>

          <Link
            href="/login"
            className="text-center text-sm text-gold-dark hover:text-gold"
          >
            ← Back to login
          </Link>
        </form>
      )}
    </div>
  );
}
