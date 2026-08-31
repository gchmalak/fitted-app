"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
  CarouselSlide,
} from "@/services/carousel.service";
import { uploadImage } from "@/services/upload.service";
import BreadCrumbs from "@/components/BreadCrumbs";
//draft key
const DRAFT_KEY = "carousel-form-draft";
// draft state
type DraftState = {
  editingId: string | null;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  order: number;
};
// GET SAVED DRAFT FUNCTION
function getSavedDraft(): DraftState | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = sessionStorage.getItem(DRAFT_KEY); //session storage so that draft stays when page refreshes and gets deleted when page is changed
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

const DEFAULT_STATE: DraftState = {
  editingId: null,
  imageUrl: "",
  ctaText: "Explore collection →",
  ctaLink: "/shop",
  order: 0,
};
// ADMIN CAROUSEL SECTION_________________________________________________________________________________
function AdminCarouselContent() {
  // useQueryClient_______________________________________________________________________________________
  const queryClient = useQueryClient();
  // states___________________________________________________________________________________________________
  const [isUploading, setIsUploading] = useState(false);

  const initial = getSavedDraft() ?? DEFAULT_STATE;
  const [editingId, setEditingId] = useState<string | null>(initial.editingId);
  const [imageUrl, setImageUrl] = useState(initial.imageUrl);
  const [ctaText, setCtaText] = useState(initial.ctaText);
  const [ctaLink, setCtaLink] = useState(initial.ctaLink);
  const [order, setOrder] = useState(initial.order);

  // save to sessionStorage on every change
  useEffect(() => {
    const draft: DraftState = { editingId, imageUrl, ctaText, ctaLink, order };
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [editingId, imageUrl, ctaText, ctaLink, order]);
  //useEffect______________________________________________________________________________________________
  // clear the draft when leaving this page (but NOT on refresh, since
  // refresh destroys the JS context before this cleanup can run)
  useEffect(() => {
    return () => {
      sessionStorage.removeItem(DRAFT_KEY);
    };
  }, []);
  // useQuery__________________________________________________________________________________________________
  const { data, isLoading } = useQuery({
    queryKey: ["carousel", "admin"],
    queryFn: getAllSlides,
  });
  // useMutation____________________________________________________________________________________________
  const createMutation = useMutation({
    mutationFn: createSlide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousel"] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CarouselSlide> }) =>
      updateSlide(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousel"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSlide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousel"] });
    },
  });
  // reset form
  const resetForm = () => {
    setEditingId(null);
    setImageUrl("");
    setCtaText("Explore collection →");
    setCtaLink("/shop");
    setOrder(0);
    sessionStorage.removeItem(DRAFT_KEY);
  };
  // start editing
  const startEditing = (slide: CarouselSlide) => {
    setEditingId(slide._id);
    setImageUrl(slide.imageUrl);
    setCtaText(slide.ctaText);
    setCtaLink(slide.ctaLink);
    setOrder(slide.order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await uploadImage(file);
      setImageUrl(res.data.url);
    } catch (err) {
      alert("Failed to upload slide image.");
    } finally {
      setIsUploading(false);
    }
  };
  // handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert("Please upload a slide image.");
      return;
    }

    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        data: { imageUrl, ctaText, ctaLink, order },
      });
    } else {
      createMutation.mutate({
        imageUrl,
        ctaText,
        ctaLink,
        order,
        isActive: true,
      });
    }
  };

  const slides = data?.data || [];
  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-10">
      {/* Bread crumbs */}
      <BreadCrumbs
        items={[
          {
            label: "Carousel",
            href: "/dashboard/carousel",
          },
        ]}
      />
      {/* heading */}
      <h1 className="mb-8 font-serif text-3xl text-black">
        Carousel Management
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="flex h-fit flex-col gap-4 rounded-xl border border-beige bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-black">
              {editingId ? "Edit Slide" : "Add New Slide"}
            </h2>
            {/* cancel button */}
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-gray hover:text-red-500"
              >
                Cancel
              </button>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray">
              Banner Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="w-full rounded-md border border-beige bg-cream p-2 text-xs text-gray"
            />
            {/* uploading to cloudinary message */}
            {isUploading && (
              <p className="mt-1 text-xs text-gold-dark">
                Uploading to Cloudinary...
              </p>
            )}
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="mt-2 h-24 w-full rounded-md border border-beige object-cover"
              />
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray">
              CTA Text
            </label>
            <input
              type="text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="e.g. Shop Summer Sale"
              required
              className="w-full rounded-md border border-beige bg-cream px-3 py-2 text-sm text-black outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray">
              CTA Link
            </label>
            <input
              type="text"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="e.g. /category/tops"
              required
              className="w-full rounded-md border border-beige bg-cream px-3 py-2 text-sm text-black outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray">
              Display Order
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full rounded-md border border-beige bg-cream px-3 py-2 text-sm text-black outline-none focus:border-gold"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving || isUploading}
            className="mt-2 rounded-md bg-gold px-4 py-2 font-medium text-white transition hover:bg-gold-dark disabled:opacity-50"
          >
            {isSaving ? "Saving..." : editingId ? "Update Slide" : "Add Slide"}
          </button>
        </form>

        <div className="lg:col-span-2">
          {/* is Loading message */}
          {isLoading ? (
            <p className="text-gray">Loading slides...</p>
          ) : slides.length === 0 ? (
            <p className="rounded-xl border border-beige bg-white py-16 text-center text-gray">
              No slides created yet.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {slides.map((slide) => (
                <div
                  key={slide._id}
                  className={`flex flex-col items-center gap-4 rounded-xl border bg-white p-4 md:flex-row ${
                    editingId === slide._id ? "border-gold" : "border-beige"
                  }`}
                >
                  <img
                    src={slide.imageUrl}
                    alt="Slide"
                    className="h-20 w-32 rounded-lg border border-beige object-cover"
                  />

                  <div className="flex-1 space-y-1 text-center md:text-left">
                    <p className="text-sm font-semibold text-black">
                      {slide.ctaText}
                    </p>
                    <p className="text-xs text-gray">Link: {slide.ctaLink}</p>
                    <span className="inline-block rounded bg-beige px-2 py-0.5 text-xs text-gold-dark">
                      Order: {slide.order}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => startEditing(slide)}
                      className="text-xs text-gold-dark hover:text-gold"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        updateMutation.mutate({
                          id: slide._id,
                          data: { isActive: !slide.isActive },
                        })
                      }
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        slide.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-beige text-gray"
                      }`}
                    >
                      {slide.isActive ? "Active" : "Hidden"}
                    </button>

                    <button
                      onClick={() => {
                        if (confirm("Delete this slide?")) {
                          deleteMutation.mutate(slide._id);
                        }
                      }}
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminCarouselPage() {
  return <AdminCarouselContent />;
}
