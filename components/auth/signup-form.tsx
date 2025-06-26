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
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  username: z.string().min(5, "Username must be at least 5 characters"),
  displayName: z.string().min(3, "Display name must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
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
      const resp = await axios.post("http://localhost:8080/api/register", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resp.data) {
        const token = resp.data.token;
        setToken(token);
        toast.success("Successfully registered");
        setLoading(false);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(`Error during signup`, error);
      toast.error("Error while signing up");
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen overflow-y-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-black relative">


      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Centered Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className={cn(
            "w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-10 py-14 border border-white/20 shadow-2xl shadow-black/10 text-white space-y-6",
            className
          )}
          {...props}
        >
          <Link
            href="/"
            className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-xl shadow-black/25">
                <Image src="/favicon.ico" alt="Quolo Logo" width={48} height={48} />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
                Quolo
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-1">Create your account</h1>
            <p className="text-gray-300 text-sm">Please fill in the details below</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm text-gray-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder:text-gray-300 border border-white/20 focus:border-blue-500 focus:ring-blue-500/30 transition"
                {...register("email")}
                required
              />
              {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="username" className="text-sm text-gray-200">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="yourusername"
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder:text-gray-300 border border-white/20 focus:border-blue-500 focus:ring-blue-500/30 transition"
                {...register("username")}
                required
              />
              {errors.username && <p className="text-sm text-red-400 mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <Label htmlFor="displayName" className="text-sm text-gray-200">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder:text-gray-300 border border-white/20 focus:border-blue-500 focus:ring-blue-500/30 transition"
                {...register("displayName")}
                required
              />
              {errors.displayName && <p className="text-sm text-red-400 mt-1">{errors.displayName.message}</p>}
            </div>

            <div>
              <Label htmlFor="password" className="text-sm text-gray-200">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder:text-gray-300 border border-white/20 focus:border-blue-500 focus:ring-blue-500/30 transition"
                {...register("password")}
                required
              />
              {errors.password && <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-transform duration-300 hover:-translate-y-0.5"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>

          {/* Already have account */}
          <div className="text-center mt-6 text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-400 hover:underline font-semibold">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
