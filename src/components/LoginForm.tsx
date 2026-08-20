"use client";

import { login } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { LoginRequest } from "@/types/auth";

export default function LoginForm() {
  const router = useRouter();

  // _________________________________________________________________________
  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token!);

      // Redirect based on the role stored in the backend database
      if (data.data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    },
  });

  // _________________________________________________________________________
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      mutate(value as LoginRequest);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-beige bg-white p-8 shadow-sm"
    >
      <form.Field name="email">
        {(field) => (
          <div>
            <label htmlFor="email" className="text-sm font-medium text-black">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="mt-2 w-full rounded-md border border-beige bg-white px-4 py-2 text-black outline-none transition focus:border-gold"
            />
          </div>
        )}
      </form.Field>

      <form.Field name="password">
        {(field) => (
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-black"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="mt-2 w-full rounded-md border border-beige bg-white px-4 py-2 text-black outline-none transition focus:border-gold"
            />
          </div>
        )}
      </form.Field>

      {isError && <p className="text-sm text-red-500">{error.message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-md bg-gold px-6 py-3 font-medium text-pink-darkest transition hover:bg-gold-light disabled:opacity-60"
      >
        {isPending ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}
