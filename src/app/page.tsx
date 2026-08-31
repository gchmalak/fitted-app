import AboutSection from "@/components/About";

import EditorialSection from "@/components/EditorialSection";
import Hero from "@/components/Hero";

import Navbar from "@/components/Navbar";
import Pagination from "@/components/Pagination";
import ProductCarouselSection from "@/components/ProductCarouselSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <AboutSection />
      <ProductCarouselSection
        id="clothing"
        title="Latest Arrivals"
        departments={["Clothing"]}
        limit={12}
        shopLabel="Shop Clothing "
      />
      <EditorialSection slot="editorial-1" />
      <ProductCarouselSection
        id="care-essentials"
        title="Care Essentials"
        departments={["Makeup", "Skincare", "Perfume"]}
        limit={12}
        shopLabel="Shop Care "
      />
      <EditorialSection slot="editorial-2" />

      <ProductCarouselSection
        id="accessories"
        title="Accessories"
        departments={["Accessories"]}
        limit={12}
        shopLabel="Shop Accessories"
      />
    </main>
  );
}
