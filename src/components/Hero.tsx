"use client";

import { useQuery } from "@tanstack/react-query";
import EmblaCarousel from "./EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import { api } from "@/lib/axios";
import { CarouselSlideDTO } from "@/types/carousel";

const OPTIONS: EmblaOptionsType = { loop: true };
//fallback slides in case database is empty pr fetching fails
const FALLBACK_SLIDES: CarouselSlideDTO[] = [
  {
    _id: "1",
    imageUrl: "/Mainheropic.jpg",
    bgColor: "#F8F5F0",
    ctaLink: "/shop",
    ctaText: "Explore collection",
    order: 0,
    isActive: true,
  },
  {
    _id: "2",
    imageUrl: "/secondheropic.jpg",
    bgColor: "#EFE8DD",
    ctaLink: "/shop",
    ctaText: "Explore collection →",
    order: 1,
    isActive: true,
  },
  {
    _id: "3",
    imageUrl: "/thirdheopic.jpg",
    bgColor: "#E6DDD0",
    ctaLink: "/shop",
    ctaText: "Explore collection →",
    order: 2,
    isActive: true,
  },
  {
    _id: "4",
    imageUrl: "/fourthheropic.jpg",
    bgColor: "#F3EEE6",
    ctaLink: "/shop",
    ctaText: "Explore collection →",
    order: 3,
    isActive: true,
  },
  {
    _id: "5",
    imageUrl: "/fifthheropic.jpg",
    bgColor: "#E9E2D7",
    ctaLink: "/shop",
    ctaText: "Explore collection →",
    order: 4,
    isActive: true,
  },
];

export default function Hero() {
  const { data: slides, isLoading } = useQuery<CarouselSlideDTO[]>({
    queryKey: ["carousel", "public"],
    queryFn: async () => {
      const { data } = await api.get("/carousel/public");
      return data.data;
    },
    staleTime: 1000 * 60 * 10, //cache for 10 minutes
  });
  const displaySlides = slides && slides.length > 0 ? slides : FALLBACK_SLIDES;
  if (isLoading) {
    return (
      <section
        id="home"
        data-navtheme="light"
        className="h-svh w-full bg-cream animate-pulse flex items-center justify-center"
      >
        <span className="text-xs uppercase tracking-[0.25em] text-slate-400">
          Loading FITTED...
        </span>
      </section>
    );
  }
  return (
    <section id="home" className="bg-cream">
      <EmblaCarousel slides={displaySlides} options={OPTIONS} />
    </section>
  );
}
