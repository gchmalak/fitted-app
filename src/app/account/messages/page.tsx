"use client";

import BreadCrumbs from "@/components/BreadCrumbs";
import ContactChat from "@/components/ContactChat";

export default function AccountMessagesPage() {
  return (
    <main className="min-h-screen bg-cream px-6 pb-16 pt-32">
      <div className="mx-auto max-w-6xl">
        <BreadCrumbs
          baseHref="/"
          baseLabel="Home"
          items={[
            {
              label: "Account",
              href: "/account",
            },
            {
              label: "Messages",
              href: "/account/messages",
            },
          ]}
        />

        <div className="mb-8">
          <h1 className="font-serif text-4xl text-black">Messages</h1>

          <p className="mt-2 text-gray">
            Continue your conversations with FITTED support.
          </p>
        </div>

        <ContactChat />
      </div>
    </main>
  );
}
