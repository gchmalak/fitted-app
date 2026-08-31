"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "@/services/auth.service";
import { useRouter } from "next/navigation";

export default function ChangePasswordForm() {
  const router = useRouter();

  const { mutate, isPending, isSuccess, error, isError } = useMutation({
    mutationFn: changePassword,

    onSuccess: () => {
      setTimeout(() => {
        router.push("/account");
      }, 1500);
    },
  });

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },

    onSubmit: async ({ value }) => {
      mutate(value);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-5"
    >
      {/* Current Password */}
      <form.Field name="currentPassword">
        {(field) => (
          <div>
            <label
              htmlFor="currentPassword"
              className="text-sm font-medium text-black"
            >
              Current Password
            </label>

            <input
              id="currentPassword"
              type="password"
              required
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="mt-2 w-full rounded-md border border-beige bg-cream px-4 py-3 text-black outline-none transition focus:border-gold"
            />
          </div>
        )}
      </form.Field>

      {/* New Password */}
      <form.Field name="newPassword">
        {(field) => (
          <div>
            <label
              htmlFor="newPassword"
              className="text-sm font-medium text-black"
            >
              New Password
            </label>

            <input
              id="newPassword"
              type="password"
              required
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="mt-2 w-full rounded-md border border-beige bg-cream px-4 py-3 text-black outline-none transition focus:border-gold"
            />

            <p className="mt-2 text-xs text-gray">
              At least 8 characters, with an uppercase letter, lowercase letter,
              and a number.
            </p>
          </div>
        )}
      </form.Field>

      {/* Error */}
      {isError && (
        <p className="text-sm text-red-500">
          {error instanceof Error
            ? error.message
            : "Failed to change password."}
        </p>
      )}

      {/* Success */}
      {isSuccess && (
        <p className="text-sm text-green-600">
          Password changed successfully. Redirecting...
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-md bg-gold px-6 py-3 font-medium text-white transition hover:bg-gold-light disabled:opacity-60"
      >
        {isPending ? "Changing..." : "Change Password"}
      </button>
    </form>
  );
}
