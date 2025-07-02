"use client";

import { cn, handleGoogleLogin } from "@/lib/utils";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import image2 from "@/public/favicon.ico"
import { ArrowLeft, Shield, Zap, Users, Sparkles } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setToken } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (userData: z.infer<typeof loginSchema>) => {
    setLoading(true);
    try {
      const resp = await axios.post(
        "http://localhost:8080/api/v1/auth/login", // ✅ Correct endpoint
        {
          email: userData.username, // ✅ send email as `email`
          password: userData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (resp.data) {
        const token = resp.data.token;
        toast.success("🎉 Welcome back!");
        setToken(token);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(`Error while logging in`, error);
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex w-full h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">

    {/* Glassmorphic Background Elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl"></div>
    </div>
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl p-10 py-14 border border-white/30 shadow-2xl shadow-black/10">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          {/* Header */}
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-xl shadow-black/25">
                <Image
                  src="/favicon.ico" // Or use imported StaticImageData
                  alt="Quolo Logo"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Quolo
              </span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Welcome back!
            </h1>
            <p className="text-gray-600">
              Sign in to your account to continue managing your social media
            </p>
          </div>


          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Username
              </Label>
              <Input
                id="username"
                className="w-full px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-white/30 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 shadow-inner"
                type="text"
                placeholder="Enter your username"
                {...register("username")}
                required
              />
              {errors.username && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <a
                  href="#"
                  className="text-sm text-orange-600 hover:text-orange-700 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                className="w-full px-4 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-white/30 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 shadow-inner"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                required
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-800  text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-3 border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              onClick={handleGoogleLogin}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Benefits & Testimonial */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 text-white p-12 items-center">

        <div className="max-w-lg">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">
            ⚡ Join 10,000+ creators
          </Badge>

          <h2 className="text-4xl font-bold mb-6">
            Manage all your social media in one place
          </h2>

          <p className="text-xl mb-8 text-orange-100">
            Save 3+ hours every week with automated posting, smart scheduling,
            and powerful analytics.
          </p>

          {/* Features */}
          <div className="space-y-4 mb-12">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <span>One-click posting to all platforms</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <span>Secure and privacy-focused</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>Smart analytics and insights</span>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <p className="text-lg mb-4">
              "Quolo saved me 3+ hours every week. The dashboard is beautiful
              and it just works!"
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold mr-3">
                R
              </div>
              <div>
                <div className="font-semibold">Raj K.</div>
                <div className="text-orange-200 text-sm">Indie Maker</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
