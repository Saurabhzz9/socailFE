"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Calendar,
  BarChart3,
  Zap,
  Shield,
  Star,
  ArrowRight,
  CheckCircle,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
  Sparkles,
  Target,
} from "lucide-react"
import Image from "next/image";
import image2 from "@/public/favicon.ico"

export default function LandingPage() {
  const [currentRole, setCurrentRole] = useState(0)

  const roles = ["Pro", , "Dreamer", "Boss", ]

  useEffect(() => {
    const roleInterval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length)
    }, 2000)

    return () => {
      clearInterval(roleInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white relative">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={image2}
                  alt="Quolo Logo"
                  className="w-full h-full object-cover"
                  width={40}
                  height={40}
                />
              </div>
              <span className="text-2xl font-bold text-black">Quolo</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Pricing
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Reviews
              </a>
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="bg-black hover:bg-gray-800 text-white shadow-lg">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Badge */}
          <Badge className="mb-6 bg-black text-white border-gray-200 shadow-lg">
            ⚡ Launch Special: 50% off first month
          </Badge>

          {/* Animated Headlines */}
          <div className="space-y-6 mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              <span className="text-black">Post Smarter With </span>
              <span className="text-blue-600">Quolo</span>
            </h1>

            <h2 className="text-2xl lg:text-4xl font-bold text-gray-800">
              <span>Schedule Like a </span>
              <span className="inline-block relative w-32 h-8">
                {roles.map((role, index) => (
                  <span
                    key={role}
                    className={`absolute left-0 top-0 transition-all duration-700 ease-in-out ${currentRole === index
                      ? "opacity-100 transform translate-y-0"
                      : "opacity-0 transform translate-y-4"
                      } text-black font-bold`}
                  >
                    {role}
                  </span>
                ))}
              </span>
            </h2>

            {/* Subheading */}
            <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
              Schedule, customize, and publish across all platforms
            </p>
          </div>

          {/* Clustered Platform Icons */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center items-center gap-4 max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300">
                <Instagram className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300">
                <Twitter className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300">
                <Youtube className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300">
                <Facebook className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300">
                <Linkedin className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300">
                <span className="text-white font-bold text-xl">P</span>
              </div>
            </div>
          </div>

          {/* Main CTA */}
          <div className="mb-12">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white text-lg px-12 py-4 h-auto shadow-lg"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                A
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                B
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                C
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                D
              </div>
            </div>
            <div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                Loved by <span className="font-semibold animate-pulse">8,999</span> small businesses
              </span>
            </div>
          </div>

          {/* Success Badge */}
          <div className="bg-green-50 border border-green-200 px-6 py-3 rounded-full mx-auto w-fit mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700 font-medium">Posted to all platforms</span>
            </div>
          </div>

          {/* All Platforms List */}
          <div>
            <p className="text-sm text-gray-500 mb-4">Connect all your accounts:</p>
            <div className="flex flex-wrap justify-center items-center gap-3">
              <Instagram className="w-6 h-6 text-pink-500 hover:scale-125 transition-transform cursor-pointer" />
              <Twitter className="w-6 h-6 text-black hover:scale-125 transition-transform cursor-pointer" />
              <Facebook className="w-6 h-6 text-blue-600 hover:scale-125 transition-transform cursor-pointer" />
              <Linkedin className="w-6 h-6 text-blue-700 hover:scale-125 transition-transform cursor-pointer" />
              <Youtube className="w-6 h-6 text-red-500 hover:scale-125 transition-transform cursor-pointer" />
              <MessageCircle className="w-6 h-6 text-green-500 hover:scale-125 transition-transform cursor-pointer" />
              <span className="text-gray-400 text-sm font-medium">+10 more</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-black mb-2">10,000+</div>
              <div className="text-gray-600">Posts Scheduled</div>
            </div>
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-black mb-2">3+ Hours</div>
              <div className="text-gray-600">Saved Per Week</div>
            </div>
            <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-black mb-2">50%+</div>
              <div className="text-gray-600">Engagement Boost</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
              All your social content.{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Managed in one place.
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to scale your social media presence without the hassle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-3">🚀 One-Click Posting</h3>
                <p className="text-gray-600">
                  Publish content to all major platforms in seconds. No more copy-pasting.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">🗓️ Smart Scheduling</h3>
                <p className="text-gray-600">Set it and forget it—perfect timing, every time.</p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">📊 Performance Analytics</h3>
                <p className="text-gray-600">Track engagement, impressions, and platform-wise insights.</p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">📂 Unified Dashboard</h3>
                <p className="text-gray-600">Visual content calendar + media library + account manager.</p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">🎯 Platform Customization</h3>
                <p className="text-gray-600">Adjust captions, hashtags, and formats per platform.</p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-3">🔒 Secure & Private</h3>
                <p className="text-gray-600">Your credentials stay secure—always. Privacy-first approach.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">Why choose us over legacy tools?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Affordable</h3>
              <p className="text-gray-600">Pricing made for real creators, not agencies.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Focused</h3>
              <p className="text-gray-600">No bloated features—just what you actually need.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧘‍♂️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Simple UI</h3>
              <p className="text-gray-600">Built for speed, not headaches.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Privacy-First</h3>
              <p className="text-gray-600">Your credentials stay secure—always.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">Loved by creators worldwide</h2>
            <p className="text-xl text-gray-600">Real feedback from real users</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Took my posting time from 2 hours to 15 minutes a week. Game changer for my side project!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    R
                  </div>
                  <div>
                    <div className="font-semibold">Raj K.</div>
                    <div className="text-gray-500 text-sm">Indie Maker</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "The dashboard and analytics made it 10x easier to scale our content strategy."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    T
                  </div>
                  <div>
                    <div className="font-semibold">Tanya M.</div>
                    <div className="text-gray-500 text-sm">Growth Manager</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "A life-saver for side projects. Honestly just works without any fuss."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    A
                  </div>
                  <div>
                    <div className="font-semibold">Aditya</div>
                    <div className="text-gray-500 text-sm">Dev Founder</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">Simple pricing. No contracts.</h2>
            <p className="text-xl text-gray-600">Cancel anytime. Start free.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <Card className="p-8 border-2 border-gray-200 hover:border-black transition-colors">
              <CardContent className="p-0">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Starter</h3>
                  <div className="text-4xl font-bold mb-4">
                    $9<span className="text-lg text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">Perfect for individuals</p>

                  <Button className="w-full mb-6" variant="outline">
                    Start Free Trial
                  </Button>

                  <div className="text-left space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>5 Social Accounts</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>Auto-posting</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>Analytics Dashboard</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>Unlimited Posts</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Creator Plan */}
            <Card className="p-8 border-2 border-black relative overflow-hidden">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-1 text-sm font-medium rounded-b">
                Most Popular
              </div>
              <CardContent className="p-0 pt-4">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Creator</h3>
                  <div className="text-4xl font-bold mb-4">
                    $18<span className="text-lg text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">Best for growing creators</p>

                  <Button className="w-full mb-6 bg-black hover:bg-gray-800 text-white">Start Free Trial</Button>

                  <div className="text-left space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>15 Social Accounts</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>Auto-posting</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>Analytics Dashboard</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>Platform Customization</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>1 Team Member</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="p-8 border-2 border-gray-200 hover:border-black transition-colors">
              <CardContent className="p-0">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <div className="text-4xl font-bold mb-4">
                    $27<span className="text-lg text-gray-500">/month</span>
                  </div>
                  <p className="text-gray-600 mb-6">For teams and agencies</p>

                  <Button className="w-full mb-6" variant="outline">
                    Start Free Trial
                  </Button>

                  <div className="text-left space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>Unlimited Accounts</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>Auto-posting</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>Analytics Dashboard</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>Platform Customization</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span>3+ Team Members</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">🧪 Try it free. No card required.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Start scheduling smarter—today.</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of creators who save 3+ hours every week with Quolo.</p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-4 h-auto bg-white text-black hover:bg-gray-100"
            >
              🚀 Try It Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <p className="text-sm mt-4 opacity-75">No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src="./" // or "/logo.png" if you prefer a custom one
                    alt="Quolo Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xl font-bold">Quolo</span>
              </div>
              <p className="text-gray-400">Built for creators who want to grow smarter, not harder.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platforms</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Instagram Scheduler
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Twitter/X Scheduler
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    YouTube Scheduler
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 Quolo – Built for creators</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
