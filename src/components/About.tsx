import Image from "next/image";

const STATS = [
  { value: "08+", label: "Years crafting" },
  { value: "15K+", label: "Customers dressed" },
  { value: "40+", label: "Cities shipped to" },
];

export default function About() {
  return (
    <section
      id="about"
      className="bg-cream px-6 py-24 md:px-12 lg:px-20 lg:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* Small heading */}
        <div className="mb-12 flex items-center gap-4">
          <span className="text-xs uppercase tracking-[0.3em] text-gold">
            About FITD
          </span>

          <div className="h-px flex-1 bg-beige" />
        </div>

        {/* Main content */}
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          {/* Image */}
          <div className="relative aspect-4/3 w-full overflow-hidden">
            <Image
              src="/aboutuspic2.jpg"
              alt="FITD store"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>

          {/* Text */}
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.25em] text-gold">
              Our Story
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight text-black md:text-5xl lg:text-6xl">
              Cut for
              <br />
              confidence.
            </h2>

            <p className="mt-7 text-base leading-8 text-gray md:text-lg">
              Fitted was born from a simple belief: clothing should move with
              you, not against you. Every piece is designed with intention,
              pairing considered tailoring with fabrics that hold up to real
              life.
            </p>

            {/* Divider */}
            <div className="my-10 h-px w-full bg-beige" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-3xl text-gold md:text-4xl">
                    {stat.value}
                  </p>

                  <p className="mt-2 max-w-25 text-xs leading-5 text-gray">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
