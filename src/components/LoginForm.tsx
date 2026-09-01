"use client";

import { login } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { LoginRequest } from "@/types/auth";
import { loginSchema } from "@/lib/validation/auth";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setUser } from "@/store/authSlice";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: login,

    onSuccess: async (data) => {
      // Save authentication data so it survives page refreshes
      localStorage.setItem("token", data.token!);
      localStorage.setItem("user", JSON.stringify(data.data));

      // Save user in Redux
      dispatch(setUser(data.data));

      // Everyone goes to the main website after logging in
      router.push("/");
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    validators: {
      onSubmit: loginSchema,
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
      className="flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-beige bg-white p-8 shadow-sm md:p-10"
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

            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-xs text-gold-dark">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
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

            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-xs text-gold-dark">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {isError && <p className="text-sm text-red-500">{error.message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-md bg-gold px-6 py-3 font-medium text-white transition hover:bg-gold-light disabled:opacity-60"
      >
        {isPending ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}
