"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LandingPage from "./landing/page";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Give time for auth context to initialize
    const timer = setTimeout(() => {
      setLoading(false);

      // If user is already logged in, redirect to dashboard
      if (isAuthenticated) {
        router.push("/dashboard");
      }
      // Otherwise, show landing page (no redirect needed)
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // If logged in, this will redirect to dashboard (handled in useEffect)
  // If not logged in, show landing page
  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  return <LandingPage />;
}
