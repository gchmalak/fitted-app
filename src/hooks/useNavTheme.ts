"use client";

import { useEffect, useState } from "react";

export function useNavTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    function updateTheme() {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-navtheme]"),
      );

      if (sections.length === 0) {
        setTheme("dark");
        return;
      }

      // The navbar is around 80px tall.
      // Check which themed section is underneath it.
      const navbarHeight = 80;

      const visibleSection = sections.find((section) => {
        const rect = section.getBoundingClientRect();

        return rect.top <= navbarHeight && rect.bottom > navbarHeight;
      });

      if (visibleSection) {
        const sectionTheme = visibleSection.dataset.navtheme;

        setTheme(sectionTheme === "light" ? "light" : "dark");
      }
    }

    // Initial check
    updateTheme();

    // Update when scrolling between sections
    window.addEventListener("scroll", updateTheme, { passive: true });

    // Update when the carousel changes data-navtheme
    const mutationObserver = new MutationObserver(() => {
      updateTheme();
    });

    mutationObserver.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-navtheme"],
    });

    // Update after layout changes
    window.addEventListener("resize", updateTheme);

    return () => {
      window.removeEventListener("scroll", updateTheme);
      window.removeEventListener("resize", updateTheme);
      mutationObserver.disconnect();
    };
  }, []);

  return theme;
}