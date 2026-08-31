import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 w-full max-w-md text-left">
        <Link
          href="/"
          className="text-sm text-gold transition-colors hover:text-gold-dark"
        >
          Home
        </Link>
      </div>

      <h1 className="mb-6 font-serif text-3xl text-black">Welcome back</h1>

      <LoginForm />

      <p className="mt-4 text-center text-sm text-gray">
        Don't have an account?{" "}
        <Link href="/register" className="text-gold hover:text-gold-light">
          Register
        </Link>
      </p>

      <div className="text-right">
        <Link
          href="/forgot-password"
          className="text-xs text-gold-dark hover:text-gold"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}
