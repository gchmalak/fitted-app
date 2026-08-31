"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuery } from "@tanstack/react-query";
import { getEditorials } from "@/services/editorial.service";
import { EditorialSlot } from "@/types/editorial";

gsap.registerPlugin(ScrollTrigger);

type EditorialSectionProps = {
  slot: EditorialSlot;
};

export default function EditorialSection({ slot }: EditorialSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const image2Ref = useRef<HTMLDivElement | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["editorials"],
    queryFn: getEditorials,
  });

  const editorial = data?.data.find((e) => e.slot === slot);
  const hasSecondImage = !!editorial?.image2Url;

  useEffect(() => {
    // no crossfade to run if there's no second image
    if (
      !sectionRef.current ||
      !image2Ref.current ||
      !editorial ||
      !hasSecondImage
    )
      return;

    const ctx = gsap.context(() => {
      gsap.to(image2Ref.current, {
        opacity: 1,
        duration: 3,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [editorial, hasSecondImage]);

  if (isLoading || !editorial) return null;

  return (
    <section
      ref={sectionRef}
      data-navtheme="dark"
      className="relative h-[80vh] w-full overflow-hidden"
    >
      <div className="absolute inset-0">
        <Image
          src={editorial.image1Url}
          alt=""
          fill
          sizes="100vw"
          draggable={false}
          className="object-cover"
          aria-hidden="true"
        />
      </div>

      {hasSecondImage && (
        <div ref={image2Ref} className="absolute inset-0 opacity-0">
          <Image
            src={editorial.image2Url!}
            alt=""
            fill
            sizes="100vw"
            draggable={false}
            className="object-cover"
            aria-hidden="true"
          />
        </div>
      )}

      <div className="absolute inset-0 bg-black/25" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h2 className="font-serif text-4xl text-white md:text-5xl">
          {editorial.heading}
        </h2>
        {editorial.subheading && (
          <p className="max-w-md text-sm tracking-wide text-white/90 md:text-base">
            {editorial.subheading}
          </p>
        )}
        {editorial.discoverHref && (
          <Link
            href={editorial.discoverHref}
            className="mt-2 border-b border-gold-light pb-1 text-sm uppercase tracking-widest text-gold-light transition-colors hover:text-gold"
          >
            Discover →
          </Link>
        )}
      </div>
    </section>
  );
}
