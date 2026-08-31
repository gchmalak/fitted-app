import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <section className="flex min-h-screen items-center justify-center bg-pink-darkest px-6 py-24">
      {children}
    </section>
  );
}
