import About from "@/components/About";
import Hero from "@/components/Hero";
import LatestProductCarousel from "@/components/LatestProductCarousel";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <LatestProductCarousel />
    </main>
  );
}
