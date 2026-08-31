import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="bg-cream text-black">
      {/* Hero */}
      <section
        className="relative h-[70vh] min-h-125 overflow-hidden"
        data-navtheme="dark"
      >
        <Image
          src="/about-hero.jpg"
          alt="FITTED"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute inset-0 flex items-end px-6 pb-12 md:px-16 md:pb-16">
          <div className="max-w-3xl text-white">
            <p className="text-xs font-medium uppercase tracking-[0.3em]">
              FITTED — Fit It Different
            </p>
            {/* heading */}
            <h1 className="mt-4 font-serif text-5xl leading-tight md:text-7xl">
              Fashion should
              <br />
              feel personal.
            </h1>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="px-6 py-20 md:px-16 md:py-28" data-navtheme="light">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold-dark">
            Our Story
          </p>
          {/* heading */}
          <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
            Fit it your way.
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-8 text-gray md:text-base">
            FITTED was created around a simple idea: style doesn't have to
            follow a formula. The pieces you wear should reflect who you are,
            how you feel, and how you choose to move through the world.
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-gray md:text-base">
            We curate modern clothing and essentials that balance simplicity,
            quality, and individuality — giving you the freedom to make every
            piece your own.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="px-6 pb-20 md:px-16 md:pb-28" data-navtheme="light">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-20">
          <div className="relative aspect-4/5 overflow-hidden">
            <Image
              src="/about-story.jpg"
              alt="FITTED collection"
              fill
              className="object-cover"
            />
          </div>

          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold-dark">
              Why FITTED
            </p>
            {/* heading */}
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">
              Less noise.
              <br />
              More intention.
            </h2>

            <p className="mt-7 text-sm leading-8 text-gray md:text-base">
              Fashion moves quickly. We believe your wardrobe doesn't have to.
              FITTED focuses on pieces that can move between seasons, occasions,
              and different versions of yourself.
            </p>

            <p className="mt-5 text-sm leading-8 text-gray md:text-base">
              Rather than building around fleeting trends, we look for
              considered silhouettes, versatile designs, and details that make a
              piece worth wearing again and again.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section
        className="border-y border-beige bg-white px-6 py-20 md:px-16 md:py-28"
        data-navtheme="light"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold-dark">
              Our Philosophy
            </p>

            <h2 className="mt-4 font-serif text-4xl md:text-5xl">
              Designed with intention.
            </h2>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-3">
            <div>
              <span className="font-serif text-2xl text-gold-dark">01</span>

              <h3 className="mt-5 font-serif text-2xl">Quality</h3>

              <p className="mt-4 text-sm leading-7 text-gray">
                Thoughtfully selected pieces made to become part of your
                wardrobe, not simply pass through it.
              </p>
            </div>

            <div>
              <span className="font-serif text-2xl text-gold-dark">02</span>

              <h3 className="mt-5 font-serif text-2xl">Craftsmanship</h3>

              <p className="mt-4 text-sm leading-7 text-gray">
                We pay attention to materials, construction, and the small
                details that make everyday pieces feel considered.
              </p>
            </div>

            <div>
              <span className="font-serif text-2xl text-gold-dark">03</span>

              <h3 className="mt-5 font-serif text-2xl">Timeless Design</h3>

              <p className="mt-4 text-sm leading-7 text-gray">
                Styles designed to live beyond a single trend or season and
                remain relevant as your personal style evolves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial statement */}
      <section className="px-6 py-24 md:px-16 md:py-32" data-navtheme="light">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-serif text-4xl leading-tight md:text-6xl">
            "The best style is the one
            <br className="hidden md:block" />
            that feels like you."
          </p>

          <p className="mt-6 text-xs uppercase tracking-[0.25em] text-gray">
            FITTED
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="border-t border-[#3D3028] bg-[#2B211B] px-6 py-24 text-center md:py-32"
        data-navtheme="dark"
      >
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
          Fit It Different
        </p>
        {/* heading */}
        <h2 className="mt-5 font-serif text-4xl text-cream md:text-6xl">
          Find your fit.
          <br />
          Make it different.
        </h2>
        {/* shop link */}
        <Link
          href="/products"
          className="mt-8 inline-block border border-cream px-7 py-3 text-sm font-medium text-cream transition-colors hover:bg-cream hover:text-[#2B211B]"
        >
          Shop the collection
        </Link>
      </section>
    </main>
  );
}
