import BreadCrumbs from "@/components/BreadCrumbs";
import ChangePasswordForm from "@/components/ChangePaswordForm";

export default function ChangePasswordPage() {
  return (
    <main className="min-h-screen bg-cream px-6 pb-16 pt-32">
      <div className="mx-auto max-w-5xl">
        <BreadCrumbs
          baseHref="/"
          baseLabel="Home"
          items={[
            { label: "Account", href: "/account" },
            { label: "Change Password" },
          ]}
        />

        <h1 className="font-serif text-4xl text-black">Change Password</h1>

        <p className="mt-2 text-gray">
          Update your password to keep your account secure.
        </p>

        <section className="mt-10 max-w-xl rounded-xl border border-beige bg-white p-8">
          <ChangePasswordForm />
        </section>
      </div>
    </main>
  );
}
