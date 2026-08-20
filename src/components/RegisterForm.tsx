"use client";

import { register } from "@/services/auth.service";
import { RegisterRequest } from "@/types/auth";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Redirect to admin dashboard if the backend assigned admin, otherwise home
      if (data.data?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    },
  });

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      mutate(value as RegisterRequest);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-black bg-cream p-8 md:p-10"
    >
      <form.Field name="username">
        {(field) => (
          <div>
            <label htmlFor="username" className="text-sm text-pink-light">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              minLength={3}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="mt-2 w-full rounded-md border border-black bg-cream px-4 py-2 text-gray outline-none focus:border-black"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="email">
        {(field) => (
          <div>
            <label htmlFor="email" className="text-sm text-black">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="mt-2 w-full rounded-md border border-black bg-cream px-4 py-2 text-gary outline-none focus:border-black"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="password">
        {(field) => (
          <div>
            <label htmlFor="password" className="text-sm text-black">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="mt-2 w-full rounded-md border border-black bg-cream px-4 py-2 text-gray outline-none focus:border-black"
            />
            <p className="mt-1 text-xs text-pink-light">
              At least 8 characters, with an uppercase letter, lowercase letter,
              and a number.
            </p>
          </div>
        )}
      </form.Field>

      {isError && <p className="text-sm text-gold">{error.message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-md border border-black bg-cream px-6 py-3 font-medium text-gray transition hover:bg-beige disabled:opacity-60"
      >
        {isPending ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
