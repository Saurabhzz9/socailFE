"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthCallback() {
  const router = useRouter();
  const { setToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      setToken(token);
      localStorage.setItem("qoulo_token", token);
      router.push("/dashboard");
    } else {
      // handle error
      router.push("/auth/login");
    }
  }, [router, setToken]);

  return <div>Logging you in...</div>;
} 