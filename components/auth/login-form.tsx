"use client"

import { cn, handleGoogleLogin } from "@/lib/utils"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { z } from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import axios from "axios"

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setToken } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (userData: z.infer<typeof loginSchema>) => {
    setLoading(true)
    try {
      const resp = await axios.post(
        "http://localhost:8080/api/login",
        {
          username: userData.username,
          password: userData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (resp.data) {
        const token = resp.data.token
        toast.success("Successfully logged in")
        setToken(token)
        setLoading(false)
        router.push("/dashboard")
      }
    } catch (error) {
      console.error(`Error while logging`, error)
      toast.error("Error while logging")
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "w-full max-w-md mx-auto mt-12 p-8 bg-white/30 dark:bg-black/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-500 flex flex-col gap-6",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-tr from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-xl">Q</span>
          </div>
          <span className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-wide">Quolo</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Login to your account</h1>
        <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">Enter your credentials to access your dashboard</p>
      </div>

      <div className="grid gap-6 mt-4">
        <div className="grid gap-2">
          <Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Username
          </Label>
          <Input
            id="username"
            className="rounded-xl bg-white/70 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            type="text"
            placeholder="Enter your username"
            {...register("username")}
            required
          />
          {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </Label>
            <a href="#" className="text-sm text-blue-600 hover:underline transition">
              Forgot?
            </a>
          </div>
          <Input
            id="password"
            className="rounded-xl bg-white/70 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            type="password"
            {...register("password")}
            required
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl py-3 shadow-lg hover:scale-[1.02] transition-transform duration-300"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative bg-white dark:bg-black px-3 text-sm text-gray-500 dark:text-gray-400">
            Or continue with
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          onClick={handleGoogleLogin}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="22px" height="22px">
            <path
              fill="#FFC107"
              d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.9-5.9C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.1-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.2 15.6 18.7 12 24 12c3 0 5.7 1.1 7.8 2.9l5.9-5.9C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.5 6.3 14.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.3 0 10.1-2 13.6-5.3l-6.3-5.2c-2 1.4-4.6 2.3-7.3 2.3-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.7 39.5 16.3 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-0.8 2.3-2.3 4.3-4.3 5.7l6.3 5.2c0.5-0.5 1.1-1.1 1.6-1.7 2.7-3.1 4.1-7 4.1-11.2 0-1.2-.1-2.1-.4-3.5z"
            />
          </svg>
          <span className="font-medium text-gray-700 dark:text-gray-200">Login with Google</span>
        </Button>
      </div>

      <div className="text-center text-sm mt-6 text-gray-600 dark:text-gray-300">
        Don't have an account?{" "}
        <a href="/auth/signup" className="text-blue-600 hover:underline font-medium">
          Sign up
        </a>
      </div>
    </form>
  )
}
