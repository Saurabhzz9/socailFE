"use client"

import { cn } from "@/lib/utils"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { z } from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  username: z.string().min(5, "Username must be at least 5 characters"),
  displayName: z.string().min(3, "Display name must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const [loading, setLoading] = useState(false)
  const { setToken } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmitForm = async (userData: z.infer<typeof signupSchema>) => {
    setLoading(true)
    try {
      const resp = await axios.post(
        "http://localhost:8080/api/register",
        {
          email: userData.email,
          username: userData.username,
          password: userData.password,
          displayName: userData.displayName,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (resp.data) {
        const token = resp.data.token
        setToken(token)
        toast.success("Successfully registered")
        setLoading(false)
        router.push("/dashboard")
      }
    } catch (error) {
      console.error(`Error during signup`, error)
      toast.error("Error while signing up")
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmitForm)}
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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Create your account</h1>
        <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">Please fill these details to get started</p>
      </div>

      <div className="grid gap-6 mt-4">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="rounded-xl bg-white/70 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            {...register("email")}
            required
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="yourusername"
            className="rounded-xl bg-white/70 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            {...register("username")}
            required
          />
          {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="rounded-xl bg-white/70 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            {...register("password")}
            required
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="displayName" className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Display Name
          </Label>
          <Input
            id="displayname"
            type="text"
            placeholder="John Doe"
            className="rounded-xl bg-white/70 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            {...register("displayName")}
            required
          />
          {errors.displayName && <p className="text-sm text-red-500">{errors.displayName.message}</p>}
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl py-3 shadow-lg hover:scale-[1.02] transition-transform duration-300"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign up"}
        </Button>
      </div>

      <div className="text-center text-sm mt-6 text-gray-600 dark:text-gray-300">
        Already have an account?{" "}
        <a href="/auth/login" className="text-blue-600 hover:underline font-medium">
          Log in
        </a>
      </div>
    </form>
  )
}
