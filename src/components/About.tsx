import Image from "next/image";
import Link from "next/link";

export default function AboutSection() {
  return (
    <section
      data-navtheme="light"
      className="bg-cream px-6 py-20 md:px-16 md:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-16">
        {/* Image */}
        <div className="relative aspect-4/5 overflow-hidden">
          <Image
            src="/about-preview.jpg"
            alt="FITTED editorial"
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-gold-dark">
            About FITTED
          </p>

          <h2 className="mt-4 font-serif text-4xl leading-tight text-black md:text-5xl">
            Modern fashion.
            <br />
            Timeless style.
          </h2>

          <p className="mt-6 text-sm leading-7 text-gray md:text-base">
            FITTED is built around thoughtful pieces, refined silhouettes, and
            everyday essentials designed to fit your individual style.
          </p>

          <p className="mt-4 text-sm leading-7 text-gray md:text-base">
            We believe fashion should feel personal — not dictated by trends,
            but shaped by the way you choose to wear it.
          </p>

          <Link
            href="/about"
            className="mt-8 inline-flex border-b border-black pb-1 text-sm font-medium text-black transition-colors hover:border-gold hover:text-gold-dark"
          >
            Discover our story →
          </Link>
        </div>
      </div>
    </section>
  );
}
