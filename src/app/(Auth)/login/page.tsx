import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-6 font-serif text-3xl text-black">Welcome back</h1>
      <LoginForm />

      <p className="mt-4 text-center text-sm text-pink-light">
        Don't have an account?{' '}
        <a href="/register" className="text-gold hover:text-gold-light">
          Register
        </a>
      </p>
    </div>
  );
}
