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
  const { user, isAdmin, isOwner, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && !isLoading && (!user || (!isAdmin && !isOwner))) {
      router.push("/login");
    }
  }, [hasMounted, user, isAdmin, isOwner, isLoading, router]);

  // Don't render role-dependent UI until mounted on client
  if (!hasMounted || isLoading) {
    return <p className="p-16 text-center text-black">Checking access...</p>;
  }

  if (user && (isAdmin || isOwner)) {
    return <>{children}</>;
  }

  return null;
}
