"use client";

import { useState } from "react";
import RequireAdmin from "@/components/RequireAdmin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
  CarouselSlide,
} from "@/services/carousel.service";
import { uploadImage } from "@/services/upload.service";

function AdminCarouselContent() {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const [imageUrl, setImageUrl] = useState("");
  const [ctaText, setCtaText] = useState("Explore collection →");
  const [ctaLink, setCtaLink] = useState("/shop");
  const [order, setOrder] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["carousel", "admin"],
    queryFn: getAllSlides,
  });

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
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSlide,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousel"] });
    },
  });

  const resetForm = () => {
    setImageUrl("");
    setCtaText("Explore collection →");
    setCtaLink("/shop");
    setOrder(0);
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert("Please upload a slide image.");
      return;
    }

    createMutation.mutate({
      imageUrl,
      ctaText,
      ctaLink,
      order,
      isActive: true,
    });
  };

  const slides = data?.data || [];

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-10">
      <h1 className="mb-8 font-serif text-3xl text-black">
        Carousel Management
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Create Slide Form */}
        <form
          onSubmit={handleSubmit}
          className="flex h-fit flex-col gap-4 rounded-xl border border-beige bg-white p-6"
        >
          <h2 className="font-serif text-xl text-black">Add New Slide</h2>

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
            disabled={createMutation.isPending || isUploading}
            className="mt-2 rounded-md bg-gold px-4 py-2 font-medium text-white transition hover:bg-gold-dark disabled:opacity-50"
          >
            {createMutation.isPending ? "Saving..." : "Add Slide"}
          </button>
        </form>

        {/* Existing Slides List */}
        <div className="lg:col-span-2">
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
                  className="flex flex-col items-center gap-4 rounded-xl border border-beige bg-white p-4 md:flex-row"
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
  return (
    <RequireAdmin>
      <AdminCarouselContent />
    </RequireAdmin>
  );
}
