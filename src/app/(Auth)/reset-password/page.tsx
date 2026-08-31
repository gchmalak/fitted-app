import { Suspense } from "react";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    // suspense bcz useSearchParams requires the component uing it to be wrapped in suspense
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
