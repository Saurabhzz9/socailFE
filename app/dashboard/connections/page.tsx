"use client";

import { AccountManager } from "@/components/dashboard/account-manager";

export default function ConnectionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Platform Connections
        </h1>
        <p className="text-muted-foreground">
          Manage your social media accounts and creator profiles
        </p>
      </div>

      <AccountManager />
    </div>
  );
}
