import RegisterForm from '@/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center">
      <h1 className=" mb-6 font-serif text-3xl text-white ">Create an account</h1>

      <RegisterForm />
      <p className=" mt-4 text-center text-sm text-pink-light">
        Already have an account?{' '}
        <a href="/login" className="text-gold hover:text-gold-light">
          Log in
        </a>
      </p>
    </div>
  );
}
