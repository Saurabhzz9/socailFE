"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Instagram,
  Youtube,
  Facebook,
  Users,
  Plus,
  Settings,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type SocialAccount = {
  id: string;
  platform: "instagram" | "facebook" | "youtube" | "tiktok";
  username: string;
  displayName: string;
  isConnected: boolean;
  isActive: boolean;
  followerCount?: number;
  profileImage?: string;
  accountType: "personal" | "business" | "creator";
  accessToken?: string;
  lastSync?: string;
};

const platformConfig = {
  instagram: {
    icon: Instagram,
    name: "Instagram",
    color: "bg-pink-500",
    textColor: "text-pink-500",
  },
  facebook: {
    icon: Facebook,
    name: "Facebook",
    color: "bg-blue-600",
    textColor: "text-blue-600",
  },
  youtube: {
    icon: Youtube,
    name: "YouTube",
    color: "bg-red-500",
    textColor: "text-red-500",
  },
  tiktok: {
    icon: Users,
    name: "TikTok",
    color: "bg-black",
    textColor: "text-black",
  },
};

export function AccountManager() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    {
      id: "1",
      platform: "instagram",
      username: "@creator_gaming",
      displayName: "Creator Gaming",
      isConnected: true,
      isActive: true,
      followerCount: 125000,
      accountType: "creator",
      lastSync: "2 hours ago",
    },
    {
      id: "2",
      platform: "facebook",
      username: "@gamingpage",
      displayName: "Gaming Page",
      isConnected: false,
      isActive: false,
      followerCount: 85000,
      accountType: "business",
    },
    {
      id: "3",
      platform: "youtube",
      username: "@creatorstudio",
      displayName: "Creator Studio",
      isConnected: true,
      isActive: false,
      followerCount: 450000,
      accountType: "creator",
      lastSync: "1 day ago",
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    platform: "" as SocialAccount["platform"],
    username: "",
    displayName: "",
    accountType: "creator" as SocialAccount["accountType"],
  });

  const handleToggleActive = (accountId: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accountId ? { ...acc, isActive: !acc.isActive } : acc,
      ),
    );
  };

  const handleConnect = async (accountId: string) => {
    const account = accounts.find((acc) => acc.id === accountId);
    if (!account) return;

    if (account.platform === "facebook") {
      // Redirect to backend Facebook OAuth connect endpoint
      window.location.href = process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/facebook/connect?user_id=${accountId}`
        : `http://localhost:8080/api/v1/facebook/connect?user_id=${accountId}`;
      return;
    }

    try {
      // Simulate connection process for other platforms
      toast.success(`Connecting to ${account.displayName}...`);
      setTimeout(() => {
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === accountId
              ? { ...acc, isConnected: true, lastSync: "Just now" }
              : acc,
          ),
        );
        toast.success(`Successfully connected to ${account.displayName}!`);
      }, 2000);
    } catch (error) {
      toast.error("Failed to connect account");
    }
  };

  const handleDisconnect = (accountId: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accountId
          ? { ...acc, isConnected: false, isActive: false, lastSync: undefined }
          : acc,
      ),
    );
    toast.success("Account disconnected");
  };

  const handleAddAccount = () => {
    if (
      !newAccount.platform ||
      !newAccount.username ||
      !newAccount.displayName
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const account: SocialAccount = {
      id: Date.now().toString(),
      platform: newAccount.platform,
      username: newAccount.username,
      displayName: newAccount.displayName,
      isConnected: false,
      isActive: false,
      accountType: newAccount.accountType,
    };

    setAccounts((prev) => [...prev, account]);
    setNewAccount({
      platform: "" as any,
      username: "",
      displayName: "",
      accountType: "creator",
    });
    setDialogOpen(false);
    toast.success("Account added successfully!");
  };

  const handleRemoveAccount = (accountId: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== accountId));
    toast.success("Account removed");
  };

  const connectedAccounts = accounts.filter((acc) => acc.isConnected);
  const activeAccounts = accounts.filter(
    (acc) => acc.isConnected && acc.isActive,
  );

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  Total Accounts
                </p>
                <p className="text-2xl font-bold">{accounts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Connected</p>
                <p className="text-2xl font-bold">{connectedAccounts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-blue-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Active</p>
                <p className="text-2xl font-bold">{activeAccounts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Social Media Accounts</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Social Media Account</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    value={newAccount.platform}
                    onValueChange={(value: SocialAccount["platform"]) =>
                      setNewAccount((prev) => ({ ...prev, platform: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="@username"
                    value={newAccount.username}
                    onChange={(e) =>
                      setNewAccount((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    placeholder="My Account"
                    value={newAccount.displayName}
                    onChange={(e) =>
                      setNewAccount((prev) => ({
                        ...prev,
                        displayName: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select
                    value={newAccount.accountType}
                    onValueChange={(value: SocialAccount["accountType"]) =>
                      setNewAccount((prev) => ({ ...prev, accountType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="creator">Creator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleAddAccount} className="w-full">
                  Add Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accounts.map((account) => {
              const PlatformIcon = platformConfig[account.platform].icon;
              return (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-lg ${platformConfig[account.platform].color}`}
                    >
                      <PlatformIcon className="w-5 h-5 text-white" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{account.displayName}</h3>
                        <Badge
                          variant={
                            account.accountType === "creator"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {account.accountType}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {account.username}
                      </p>
                      {account.followerCount && (
                        <p className="text-xs text-muted-foreground">
                          {account.followerCount.toLocaleString()} followers
                        </p>
                      )}
                      {account.lastSync && (
                        <p className="text-xs text-muted-foreground">
                          Last synced: {account.lastSync}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {account.isConnected ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        {account.isConnected ? "Connected" : "Not Connected"}
                      </span>
                    </div>

                    {account.isConnected && (
                      <div className="flex items-center space-x-2">
                        <Label
                          htmlFor={`active-${account.id}`}
                          className="text-sm"
                        >
                          Active
                        </Label>
                        <Switch
                          id={`active-${account.id}`}
                          checked={account.isActive}
                          onCheckedChange={() => handleToggleActive(account.id)}
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      {account.isConnected ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnect(account.id)}
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleConnect(account.id)}
                        >
                          Connect
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveAccount(account.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
