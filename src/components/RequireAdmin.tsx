"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RequireAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasMounted, setHasMounted] = useState(false);
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !isLoading && !isAdmin) {
      router.push("/login");
    }
  }, [hasMounted, isLoading, isAdmin, router]);

  if (!hasMounted || isLoading)
    return <p className="p-16 text-center text-black">Checking access...</p>;
  if (!isAdmin) return null;

  return <>{children}</>;
}
