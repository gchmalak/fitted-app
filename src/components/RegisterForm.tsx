"use client";

import { register, uploadProfilePicture } from "@/services/auth.service";
import { RegisterRequest } from "@/types/auth";
import { registerSchema } from "@/lib/validation/auth";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function RegisterForm() {
  const router = useRouter();

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: register,

    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      localStorage.setItem("user", JSON.stringify(data.data));

      if (data.data?.role === "admin") {
        router.push("/dashboard");
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

    validators: {
      onSubmit: registerSchema,
    },

    onSubmit: async ({ value }) => {
      setUploadError(null);

      // Profile picture is required
      if (!profilePicture) {
        setUploadError("Please choose a profile picture.");
        return;
      }

      try {
        // 1. Upload image to Cloudinary
        const uploadResponse = await uploadProfilePicture(profilePicture);

        // 2. Get Cloudinary URL
        const avatarUrl = uploadResponse.data.url;

        // 3. Register user with avatarUrl
        mutate({
          ...value,
          avatarUrl,
        } as RegisterRequest);
      } catch {
        setUploadError(
          "Could not upload your profile picture. Please try again.",
        );
      }
    },
  });

  function handleProfilePictureChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Extra frontend validation
    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be smaller than 5 MB.");
      return;
    }

    setUploadError(null);
    setProfilePicture(file);

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-beige bg-white p-8 md:p-10"
    >
      {/* Profile Picture */}
      <div className="flex flex-col items-center">
        <label htmlFor="profilePicture" className="cursor-pointer">
          {preview ? (
            <Image
              src={preview}
              alt="Profile preview"
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover border border-beige"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-gold bg-cream text-center text-xs text-gray">
              Add Photo
            </div>
          )}
        </label>

        <input
          id="profilePicture"
          type="file"
          accept="image/*"
          onChange={handleProfilePictureChange}
          className="hidden"
        />

        <label
          htmlFor="profilePicture"
          className="mt-3 cursor-pointer text-sm text-gold transition hover:text-gold-dark"
        >
          {profilePicture ? "Change photo" : "Choose profile picture"}
        </label>

        <p className="mt-1 text-xs text-gray">
          JPG, PNG or other image • Max 5 MB
        </p>
      </div>

      {uploadError && (
        <p className="text-center text-sm text-red-500">{uploadError}</p>
      )}

      {/* Username */}
      <form.Field name="username">
        {(field) => (
          <div>
            <label htmlFor="username" className="text-sm text-black">
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

            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-xs text-gold-dark">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Email */}
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
              className="mt-2 w-full rounded-md border border-black bg-cream px-4 py-2 text-gray outline-none focus:border-black"
            />

            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-xs text-gold-dark">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Password */}
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

            {field.state.meta.errors.length > 0 && (
              <p className="mt-1 text-xs text-gold-dark">
                {field.state.meta.errors.join(", ")}
              </p>
            )}

            <p className="mt-1 text-xs text-gray">
              At least 8 characters, with an uppercase letter, lowercase letter,
              and a number.
            </p>
          </div>
        )}
      </form.Field>

      {isError && <p className="text-sm text-red-500">{error.message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 rounded-md border bg-gold px-6 py-3 font-medium text-white transition hover:bg-gold-light disabled:opacity-60"
      >
        {isPending ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
