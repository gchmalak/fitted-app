"use client";

import { useEffect, useRef, useState } from "react";

export function useNavTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const visibilityMap = useRef(new Map<Element, boolean>());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityMap.current.set(entry.target, entry.isIntersecting);
        });

        // scan in current DOM order for the first still-visible section
        const allSections = Array.from(document.querySelectorAll("[data-navtheme]"));
        const topmostVisible = allSections.find((el) => visibilityMap.current.get(el));

        if (topmostVisible) {
          const value = topmostVisible.getAttribute("data-navtheme");
          setTheme(value === "light" ? "light" : "dark");
        }
      },
      {
        rootMargin: "-80px 0px -85% 0px",
        threshold: 0,
      },
    );
    observerRef.current = observer;

    // observe whatever sections already exist
    const initialSections = document.querySelectorAll("[data-navtheme]");
    initialSections.forEach((el) => {
      visibilityMap.current.set(el, false);
      observer.observe(el);
    });

    // watch for sections that mount later (e.g. after data loads)
    const mutationObserver = new MutationObserver(() => {
      const currentSections = document.querySelectorAll("[data-navtheme]");
      currentSections.forEach((el) => {
        if (!visibilityMap.current.has(el)) {
          visibilityMap.current.set(el, false);
          observer.observe(el);
        }
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return theme;
}