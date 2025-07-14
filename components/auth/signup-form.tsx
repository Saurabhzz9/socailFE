"use client";

import { cn } from "@/lib/utils";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthService } from "@/lib/services";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  username: z.string().min(5, "Username must be at least 5 characters"),
  full_name: z.string().min(3, "Full name must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmitForm = async (userData: z.infer<typeof signupSchema>) => {
    setLoading(true);
    try {
      const response = await AuthService.register({
        email: userData.email,
        username: userData.username,
        full_name: userData.full_name,
        password: userData.password,
      });

      setToken(response.token);
      toast.success("Successfully registered!");
      router.push("/dashboard");
    } catch (error: any) {
      console.error(`Error during signup`, error);
      toast.error(error.message || "Error while signing up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen overflow-y-hidden bg-background relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-primary/3 rounded-full blur-3xl"></div>
      </div>

      {/* Centered Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className={cn(
            "w-full max-w-md bg-card/80 backdrop-blur-xl rounded-3xl p-10 py-14 border border-border shadow-2xl text-foreground space-y-6",
            className,
          )}
          {...props}
        >
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/favicon.ico"
                  alt="Quolo Logo"
                  width={48}
                  height={48}
                />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Quolo
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-1 text-foreground">
              Create your account
            </h1>
            <p className="text-muted-foreground text-sm">
              Please fill in the details below
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-background/70 text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-primary/20 transition"
                {...register("email")}
                required
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="username" className="text-sm text-foreground">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="yourusername"
                className="w-full px-4 py-3 rounded-xl bg-background/70 text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-primary/20 transition"
                {...register("username")}
                required
              />
              {errors.username && (
                <p className="text-sm text-destructive mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="full_name" className="text-sm text-foreground">
                Full Name
              </Label>
              <Input
                id="full_name"
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl bg-background/70 text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-primary/20 transition"
                {...register("full_name")}
                required
              />
              {errors.full_name && (
                <p className="text-sm text-destructive mt-1">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-sm text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-background/70 text-foreground placeholder:text-muted-foreground border border-border focus:border-primary focus:ring-primary/20 transition"
                {...register("password")}
                required
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-transform duration-300 hover:-translate-y-0.5"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>

          {/* Already have account */}
          <div className="text-center mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
