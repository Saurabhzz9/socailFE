"use client";
import { useAuth } from "@/context/AuthContext";
import type React from "react";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-cawar">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Floating network nodes with connections */}
      <div className="network-nodes">
        <div className="network-node"></div>
        <div className="network-node"></div>
        <div className="network-node"></div>
        <div className="network-node"></div>
        <div className="network-node"></div>
        <div className="network-node"></div>
        <div className="network-node"></div>
        <div className="network-node"></div>
        {/* Connection lines */}
        <div className="network-connection"></div>
        <div className="network-connection"></div>
        <div className="network-connection"></div>
      </div>

      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <Header />
        <main className="flex-1 overflow-y-auto scrollbar-thin pt-6">
          <div className="w-full px-6 pb-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
