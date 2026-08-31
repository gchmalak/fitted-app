import RegisterForm from "@/components/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 w-full max-w-md text-left">
        <Link
          href="/"
          className="text-sm text-gold transition-colors hover:text-gold-dark"
        >
          Home
        </Link>
        <span className="mx-2 text-gray">/</span>
        <Link
          href="/login"
          className="text-sm text-gray transition-colors hover:text-gold"
        >
          Login
        </Link>
      </div>

      <h1 className="mb-6 font-serif text-3xl text-black">Create an account</h1>

      <RegisterForm />

      <p className="mt-4 text-center text-sm text-gray">
        Already have an account?{" "}
        <Link href="/login" className="text-gold hover:text-gold-light">
          Log in
        </Link>
      </p>
    </div>
  );
}
