"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/services/auth.service";
import { resetPasswordFormSchema } from "@/lib/validation/auth";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("This reset link is invalid or has expired.");
      return;
    }

    const result = resetPasswordFormSchema.safeParse({
      newPassword,
      confirmPassword,
    });
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
      await resetPassword({ token, newPassword: result.data.newPassword });
      setSubmitted(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("This link may have expired. Please request a new one.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-beige bg-white p-8 shadow-sm">
        <h1 className="font-serif text-3xl text-black">Invalid link</h1>
        <p className="mt-4 text-sm text-gray">
          This password reset link is missing or invalid. Please request a new
          one.
        </p>
        <Link
          href="/forgot-password"
          className="mt-4 inline-block text-sm text-gold-dark hover:text-gold"
        >
          ← Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-beige bg-white p-8 shadow-sm">
      <h1 className="font-serif text-3xl text-black">Set a new password</h1>

      {submitted ? (
        <p className="mt-6 text-sm text-gray">
          Your password has been reset. Redirecting you to login...
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-md border border-beige bg-white px-4 py-2 text-black focus:border-gold outline-none"
            />
            {fieldErrors.newPassword && (
              <p className="text-xs text-gold-dark">
                {fieldErrors.newPassword}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-md border border-beige bg-white px-4 py-2 text-black focus:border-gold outline-none"
            />
            {fieldErrors.confirmPassword && (
              <p className="text-xs text-gold-dark">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {error && <p className="text-sm text-gold-dark">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-gold px-6 py-3 font-medium text-white transition hover:bg-gold-dark disabled:opacity-60"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
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
