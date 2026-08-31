"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { getEditorials, updateEditorial } from "@/services/editorial.service";
import { uploadImage } from "@/services/upload.service";
import {
  Editorial,
  EditorialSlot,
  UpdateEditorialRequest,
} from "@/types/editorial";
import BreadCrumbs from "@/components/BreadCrumbs";
// EDITORIAL SLOT FORM FUNCTION___________________________________________________________________________
function EditorialSlotForm({
  slot,
  existing,
}: {
  slot: EditorialSlot;
  existing?: Editorial;
}) {
  // useQueryClient___________________________________________________________________________________________
  const queryClient = useQueryClient();
  // states__________________________________________________________________________________________________
  const [uploadingField, setUploadingField] = useState<
    "image1Url" | "image2Url" | null
  >(null);

  const [showSuccess, setShowSuccess] = useState(false);
  // useMutation___________________________________________________________________________________
  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: (data: UpdateEditorialRequest) => updateEditorial(slot, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editorials"] });

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    },
  });

  const form = useForm({
    defaultValues: {
      image1Url: existing?.image1Url ?? "",
      image2Url: existing?.image2Url ?? "",
      heading: existing?.heading ?? "",
      subheading: existing?.subheading ?? "",
      discoverHref: existing?.discoverHref ?? "",
    } as UpdateEditorialRequest,

    onSubmit: async ({ value }) => {
      // Image 1 is required
      if (!value.image1Url) {
        alert("Please upload Image 1.");
        return;
      }

      // Image 2 is optional.
      // If it is empty, send undefined instead of an empty string.
      mutate({
        ...value,
        image2Url: value.image2Url || undefined,
        subheading: value.subheading || undefined,
        discoverHref: value.discoverHref || undefined,
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-5 rounded-2xl border border-beige bg-white p-8 shadow-sm"
    >
      {/* heading */}
      <h2 className="font-serif text-2xl text-black">{slot}</h2>

      {/* IMAGE 1 */}
      <form.Field name="image1Url">
        {(f) => (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray">
              Image 1 <span className="text-gold-dark">*</span>
            </label>

            <input
              type="file"
              accept="image/*"
              disabled={uploadingField === "image1Url"}
              onChange={async (e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                try {
                  setUploadingField("image1Url");

                  const res = await uploadImage(file);

                  f.handleChange(res.data.url);
                } catch {
                  alert("Failed to upload image.");
                } finally {
                  setUploadingField(null);
                }
              }}
              className="rounded-md border border-beige bg-cream px-4 py-2 text-sm text-gray"
            />
            {/* uploading message */}
            {uploadingField === "image1Url" && (
              <p className="text-xs text-gold">Uploading...</p>
            )}

            {f.state.value && (
              <img
                src={f.state.value}
                alt="Editorial image 1"
                className="mt-1 h-32 w-full rounded-md object-cover"
              />
            )}
          </div>
        )}
      </form.Field>

      {/* IMAGE 2 - OPTIONAL */}
      <form.Field name="image2Url">
        {(f) => (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray">
              Image 2 <span className="font-normal text-gray">(optional)</span>
            </label>

            <input
              type="file"
              accept="image/*"
              disabled={uploadingField === "image2Url"}
              onChange={async (e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                try {
                  setUploadingField("image2Url");

                  const res = await uploadImage(file);

                  f.handleChange(res.data.url);
                } catch {
                  alert("Failed to upload image.");
                } finally {
                  setUploadingField(null);
                }
              }}
              className="rounded-md border border-beige bg-cream px-4 py-2 text-sm text-gray"
            />

            {uploadingField === "image2Url" && (
              <p className="text-xs text-gold">Uploading...</p>
            )}

            {f.state.value && (
              <div className="mt-1 flex items-start gap-3">
                <img
                  src={f.state.value}
                  alt="Editorial image 2"
                  className="h-32 w-32 rounded-md object-cover"
                />

                <button
                  type="button"
                  onClick={() => f.handleChange("")}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Remove image
                </button>
              </div>
            )}

            {!f.state.value && (
              <p className="text-xs text-gray">
                Leave empty if this editorial only needs one image.
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* HEADING */}
      <form.Field name="heading">
        {(f) => (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray">Heading</label>

            <input
              value={f.state.value}
              onChange={(e) => f.handleChange(e.target.value)}
              required
              className="rounded-md border border-beige bg-cream px-4 py-2 text-black outline-none focus:border-gold"
            />
          </div>
        )}
      </form.Field>

      {/* SUBHEADING */}
      <form.Field name="subheading">
        {(f) => (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray">
              Subheading (optional)
            </label>

            <input
              value={f.state.value}
              onChange={(e) => f.handleChange(e.target.value)}
              className="rounded-md border border-beige bg-cream px-4 py-2 text-black outline-none focus:border-gold"
            />
          </div>
        )}
      </form.Field>

      {/* DISCOVER LINK */}
      <form.Field name="discoverHref">
        {(f) => (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray">
              "Discover" link (optional)
            </label>

            <input
              value={f.state.value}
              onChange={(e) => f.handleChange(e.target.value)}
              placeholder="/products"
              className="rounded-md border border-beige bg-cream px-4 py-2 text-black outline-none focus:border-gold"
            />
          </div>
        )}
      </form.Field>

      {isError && <p className="text-sm text-gold-dark">{error.message}</p>}

      {showSuccess && (
        <p className="text-sm text-green-700">Saved successfully!</p>
      )}

      <button
        type="submit"
        disabled={isPending || uploadingField !== null}
        className="rounded-md bg-gold px-6 py-3 font-medium text-white hover:bg-gold-dark disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
// EDITORIAL ADMIN PAGE FUNCTION
function EditorialAdminPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["editorials"],
    queryFn: getEditorials,
  });

  if (isLoading) {
    return <p className="p-16 text-center text-black">Loading...</p>;
  }

  const find = (slot: EditorialSlot) => data?.data.find((e) => e.slot === slot);

  return (
    <div className="flex flex-col gap-8 p-8">
      <BreadCrumbs
        items={[
          {
            label: "Editorial",
            href: "/dashboard/Editorial",
          },
        ]}
      />
      <h1 className="font-serif text-3xl text-black">Editorial Sections</h1>

      <EditorialSlotForm slot="editorial-1" existing={find("editorial-1")} />

      <EditorialSlotForm slot="editorial-2" existing={find("editorial-2")} />
    </div>
  );
}

export default function AdminEditorialPage() {
  return <EditorialAdminPage />;
}
