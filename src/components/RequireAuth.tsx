"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasMounted, setHasMounted] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !isLoading && !user) {
      router.push("/login");
    }
  }, [hasMounted, isLoading, user, router]);

  if (!hasMounted || isLoading)
    return <p className="p-16 text-center text-black">Checking access...</p>;
  if (!user) return null;

  return <>{children}</>;
}