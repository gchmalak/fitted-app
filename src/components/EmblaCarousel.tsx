"use client";
import CartIcon from "./CartIcon";
import { useEffect, useState } from "react";
import { EmblaOptionsType } from "embla-carousel";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import Link from "next/link";
import { CarouselSlideDTO } from "@/types/carousel";

type PropType = {
  slides: CarouselSlideDTO[];
  options?: EmblaOptionsType;
};

const EmblaCarousel = (props: PropType) => {
  const { slides, options } = props;

  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);
  // Fallback background color if not explicitly defined on slide document
  const currentBgColor = slides[selectedIndex]?.bgColor || "#F8F5F0";
  return (
    <div
      id="hero"
      className="relative h-svh w-full overflow-hidden"
      style={{ backgroundColor: slides[selectedIndex].bgColor }}
    >
      {/* Carousel */}
      <div ref={emblaRef} className="h-full w-full overflow-hidden">
        <div className="flex h-full touch-pan-y">
          {slides.map((slide, index) => (
            <div
              key={slide._id || index}
              className="relative h-full min-w-0 flex-[0_0_100%]"
            >
              <Image
                src={slide.imageUrl}
                alt={`Slide ${index + 1}`}
                fill
                sizes="100vw"

                className="object-cover "
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
      {/* hero content */}
      <div className="absolute inset-0 z-10 flex items-end px-8 pb-24 md:px-16 md:pb-28 lg:px-20 lg:pb-32">
        <div className="max-w-xl text-black">
          <p className="font-serif text-5xl  tracking-wide md:text-6xl lg:text-7xl">
            FITTED
          </p>
          <p className="mt-3 text-sm uppercase tracking-[0.25em] md:text-base">
            Modern fashion. Timless style.
          </p>
          {/* dynamic cta link */}
          <Link
            href={slides[selectedIndex]?.ctaLink || "/shop"}
            className="inline-block mt-7 border-b border-black pb-2 text-sm uppercase tracking-[0.2em] transition-opacity hover:opacity-60"
          >
            {slides[selectedIndex]?.ctaText || "Explore collection →"}
          </Link>

          <Link
            href="/login"
            className="text-sm  uppercase flex flex-y mt-2 tracking-[0.2em] text-black transition-opacity hover:opacity-60"
          >
            Connect
          </Link>
          <div className="mt-2">
            <CartIcon />
          </div>
        </div>
      </div>

      {/* Previous */}
      <div className="absolute  bottom-8 left-8 z-20 md:left-16">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
      </div>

      {/* Next */}
      <div className="absolute  bottom-8 right-8 z-20 md:right-16 ">
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </div>
    </div>
  );
};

export default EmblaCarousel;
