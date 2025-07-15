"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
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
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import image2 from "@/public/favicon.ico";
import Image1 from "@/public/ss1.png"
import Image2 from "@/public/ss2.png"
import Image3 from "@/public/ss3.png"
import Image4 from "@/public/ss4.png"
import Image5 from "@/public/ss5.png"
import Image6 from "@/public/ss6.png"

export default function LandingPage() {
  const [currentRole, setCurrentRole] = useState(0);

  const roles = ["Pro", "Creator", "Dreamer", "Boss"];

  useEffect(() => {
    const roleInterval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 2000);

    return () => {
      clearInterval(roleInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating gradient orbs - theme aware */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-primary/25 to-accent/25 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-r from-accent/15 to-primary/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "6s" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-10 w-56 h-56 bg-gradient-to-r from-primary/22 to-accent/22 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "8s" }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-xl">
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
              <span className="text-2xl font-bold text-white">Quolo</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-purple-200 hover:text-white transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-purple-200 hover:text-white transition-colors font-medium"
              >
                Reviews
              </a>
              <a
                href="#pricing"
                className="text-purple-200 hover:text-white transition-colors font-medium"
              >
                Pricing
              </a>

              <Link href="/auth/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  size="sm"
                  className="bg-gradient-cawar-purple text-white shadow-lg glow-cawar hover:opacity-90"
                >
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Top Badge */}
              <Badge className="mb-6 bg-gradient-cawar-purple/20 text-purple-200 border-purple-400/30 shadow-gradient-cawar">
                ✨ Limited Time: 50% off first month
              </Badge>

              {/* Animated Headlines */}
              <div className="space-y-6 mb-12">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-white">
                  <span className="text-white">Post Smarter With </span>
                  <span className="text-gradient-cawar">Quolo</span>
                </h1>

                <h2 className="text-2xl lg:text-4xl font-bold text-gray-200">
                  <span>Schedule Like a </span>
                  <span className="inline-block relative w-32 h-8">
                    {roles.map((role, index) => (
                      <span
                        key={role}
                        className={`absolute left-0 top-0 transition-all duration-700 ease-in-out ${currentRole === index
                            ? "opacity-100 transform translate-y-0"
                            : "opacity-0 transform translate-y-4"
                          } text-gradient-cawar font-bold`}
                      >
                        {role}
                      </span>
                    ))}
                  </span>
                </h2>

                {/* Subheading */}
                <p className="text-xl text-purple-200 leading-relaxed max-w-2xl">
                  Schedule, customize, and publish across all platforms with
                  beautiful analytics
                </p>
              </div>

              {/* Clustered Platform Icons */}
              <div className="mb-12">
                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 max-w-2xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300 glow-cawar">
                    <Instagram className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-16 h-16 bg-gradient-cawar-card rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300 border border-white/10">
                    <Twitter className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300 glow-cawar">
                    <Youtube className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300 glow-cawar">
                    <Facebook className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300 glow-cawar">
                    <Linkedin className="w-8 h-8 text-white" />
                  </div>
                  <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300 glow-cawar">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Main CTA */}
              <div className="mb-2">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-cawar-purple text-white text-lg px-12 py-4 h-auto shadow-gradient-cawar glow-cawar hover:opacity-90"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full border-2 border-gray-800 flex items-center justify-center text-white text-xs font-bold">
                    A
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full border-2 border-gray-800 flex items-center justify-center text-white text-xs font-bold">
                    B
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full border-2 border-gray-800 flex items-center justify-center text-white text-xs font-bold">
                    C
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full border-2 border-gray-800 flex items-center justify-center text-white text-xs font-bold">
                    D
                  </div>
                </div>
                <div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-purple-200">
                    Loved by{" "}
                    <span className="font-semibold animate-pulse text-gradient-cawar">
                      8,999
                    </span>{" "}
                    creators
                  </span>
                </div>
              </div>
            </div>

            {/* Right Content - Dashboard Preview */}
            <div className="relative">
              <div className="bg-gradient-cawar-card rounded-3xl p-8 border border-white/10 shadow-gradient-cawar">
                {/* Browser Header */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="ml-4 text-white/60 text-sm">
                    quolo.app/dashboard
                  </div>
                </div>

                {/* Analytics Dashboard Preview */}
                <div className="bg-gradient-cawar-purple rounded-2xl p-6 text-center mb-4">
                  <BarChart3 className="w-12 h-12 text-white mx-auto mb-3" />
                  <h3 className="text-white font-semibold text-lg mb-4">
                    Live Analytics Dashboard
                  </h3>

                  {/* Mini chart simulation */}
                  <div className="flex justify-center items-end space-x-1 mb-4 h-16">
                    <div
                      className="w-2 bg-purple-300 rounded-t"
                      style={{ height: "40%" }}
                    ></div>
                    <div
                      className="w-2 bg-pink-300 rounded-t"
                      style={{ height: "60%" }}
                    ></div>
                    <div
                      className="w-2 bg-blue-300 rounded-t"
                      style={{ height: "80%" }}
                    ></div>
                    <div
                      className="w-2 bg-purple-300 rounded-t"
                      style={{ height: "70%" }}
                    ></div>
                    <div
                      className="w-2 bg-pink-300 rounded-t"
                      style={{ height: "90%" }}
                    ></div>
                    <div
                      className="w-2 bg-blue-300 rounded-t"
                      style={{ height: "100%" }}
                    ></div>
                    <div
                      className="w-2 bg-purple-300 rounded-t"
                      style={{ height: "85%" }}
                    ></div>
                  </div>

                  <div className="text-emerald-300 text-sm font-medium">
                    📈 +23.4% engagement this month
                  </div>
                </div>

                {/* Content Scheduler Preview */}
                <div className="bg-gradient-cawar-pink rounded-2xl p-6 text-center">
                  <Calendar className="w-12 h-12 text-white mx-auto mb-3" />
                  <h3 className="text-white font-semibold text-lg mb-4">
                    Smart Content Scheduler
                  </h3>

                  {/* Platform icons in dashboard */}
                  <div className="flex justify-center items-center gap-3 mb-4">
                    <Instagram className="w-5 h-5 text-pink-200" />
                    <Twitter className="w-5 h-5 text-blue-200" />
                    <Facebook className="w-5 h-5 text-blue-200" />
                    <Youtube className="w-5 h-5 text-red-200" />
                    <Linkedin className="w-5 h-5 text-blue-200" />
                    <MessageCircle className="w-5 h-5 text-green-200" />
                  </div>

                  {/* Success indicator */}
                  <div className="bg-emerald-500/20 border border-emerald-400/30 px-3 py-2 rounded-full mx-auto w-fit">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-200" />
                      <span className="text-emerald-200 text-sm font-medium">
                        47 posts scheduled
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Screenshot Section */}
      <section className="flex justify-center items-center py-12 md:py-20 relative z-10">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-purple-900/40 bg-gradient-to-br from-[#232946] to-[#18122B]">
          <Image
            src={Image1}
            alt="App Dashboard Screenshot"
            className="w-[90vw] max-w-5xl h-auto rounded-3xl border border-white/10 shadow-2xl"
            style={{
              boxShadow:
                "0 8px 64px 0 rgba(120, 80, 255, 0.25), 0 1.5px 8px 0 rgba(0,0,0,0.15)",
            }}
            placeholder="blur"
            priority
          />
          {/* Optional: Glow effect */}
          <div
            className="absolute -inset-4 rounded-3xl pointer-events-none"
            style={{
              boxShadow:
                "0 0 120px 40px rgba(120,80,255,0.15), 0 0 80px 20px rgba(255,80,200,0.10)",
            }}
          />
        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center z-10 relative">
        <div className="p-6 rounded-xl bg-gradient-to-br from-[#232946] to-[#18122B] shadow-2xl border border-purple-900/30">
          <Zap className="mx-auto mb-4 w-10 h-10 text-purple-400" />
          <h3 className="text-xl font-bold text-white mb-2">Multi-Platform Posting</h3>
          <p className="text-muted-foreground">Schedule and auto-post to Instagram, Facebook, Twitter, and more.</p>
        </div>
        <div className="p-6 rounded-xl bg-gradient-to-br from-[#232946] to-[#18122B] shadow-2xl border border-pink-900/30">
          <Sparkles className="mx-auto mb-4 w-10 h-10 text-pink-400" />
          <h3 className="text-xl font-bold text-white mb-2">AI Suggestions</h3>
          <p className="text-muted-foreground">Get smart content ideas and optimal posting times powered by AI.</p>
        </div>
        <div className="p-6 rounded-xl bg-gradient-to-br from-[#232946] to-[#18122B] shadow-2xl border border-blue-900/30">
          <Star className="mx-auto mb-4 w-10 h-10 text-blue-400" />
          <h3 className="text-xl font-bold text-white mb-2">Customizable UI</h3>
          <p className="text-muted-foreground">Personalize your dashboard with themes and layouts you love.</p>
        </div>
        <div className="p-6 rounded-xl bg-gradient-to-br from-[#232946] to-[#18122B] shadow-2xl border border-orange-900/30">
          <BarChart3 className="mx-auto mb-4 w-10 h-10 text-orange-400" />
          <h3 className="text-xl font-bold text-white mb-2">Deep Analytics</h3>
          <p className="text-muted-foreground">Track engagement, reach, and growth with beautiful charts.</p>
        </div>
      </section>


      {/* Social Proof Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gradient-cawar-card rounded-xl p-8 border border-white/10 shadow-gradient-cawar hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-gradient-cawar mb-2">
                2.4M+
              </div>
              <div className="text-purple-200">Total Reach</div>
            </div>
            <div className="bg-gradient-cawar-card rounded-xl p-8 border border-white/10 shadow-gradient-cawar hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-gradient-cawar mb-2">
                186K
              </div>
              <div className="text-purple-200">Monthly Engagement</div>
            </div>
            <div className="bg-gradient-cawar-card rounded-xl p-8 border border-white/10 shadow-gradient-cawar hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-4xl font-bold text-gradient-cawar mb-2">
                87%
              </div>
              <div className="text-purple-200">Time Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              All your social content.{" "}
              <span className="text-gradient-cawar">Managed in one place.</span>
            </h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">
              Everything you need to scale your social media presence without
              the hassle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 bg-gradient-cawar-card border-white/10 hover:shadow-gradient-cawar transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-cawar-purple rounded-lg flex items-center justify-center mb-4 glow-cawar">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  🚀 One-Click Posting
                </h3>
                <p className="text-purple-200">
                  Publish content to all major platforms in seconds. No more
                  copy-pasting.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-cawar-card border-white/10 hover:shadow-gradient-cawar transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-cawar-pink rounded-lg flex items-center justify-center mb-4 glow-cawar">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  🗓️ Smart Scheduling
                </h3>
                <p className="text-purple-200">
                  Set it and forget it—perfect timing, every time.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-cawar-card border-white/10 hover:shadow-gradient-cawar transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-cawar-blue rounded-lg flex items-center justify-center mb-4 glow-cawar">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  📊 Performance Analytics
                </h3>
                <p className="text-purple-200">
                  Track engagement, impressions, and platform-wise insights.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-cawar-card border-white/10 hover:shadow-gradient-cawar transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center mb-4 glow-cawar">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  📂 Unified Dashboard
                </h3>
                <p className="text-purple-200">
                  Visual content calendar + media library + account manager.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-cawar-card border-white/10 hover:shadow-gradient-cawar transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-4 glow-cawar">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  🎯 Platform Customization
                </h3>
                <p className="text-purple-200">
                  Adjust captions, hashtags, and formats per platform.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-cawar-card border-white/10 hover:shadow-gradient-cawar transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center mb-4 glow-cawar">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  🔒 Secure & Private
                </h3>
                <p className="text-purple-200">
                  Your credentials stay secure—always. Privacy-first approach.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Screenshots Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              See Quolo In Action
            </h2>
            <p className="text-xl text-gray-300">
              Experience the power of unified social media management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Analytics Dashboard */}
            <div className="relative">
              <div className="bg-gradient-cawar-card rounded-2xl p-6 border border-white/5 shadow-gradient-cawar">
                <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden mb-4">
                  <div className="p-4 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-orange-400 mx-auto mb-2" />
                        <div className="text-white font-semibold text-sm">
                          Analytics Dashboard
                        </div>
                        <div className="text-gray-400 text-xs">
                          Real-time insights
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Real-Time Analytics
                </h3>
                <p className="text-gray-400 text-sm">
                  Track performance across all platforms with detailed insights
                  and metrics.
                </p>
              </div>
            </div>

            {/* Content Scheduler */}
            <div className="relative">
              <div className="bg-gradient-cawar-card rounded-2xl p-6 border border-white/5 shadow-gradient-cawar">
                <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden mb-4">
                  <div className="p-4 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <Calendar className="w-12 h-12 text-orange-400 mx-auto mb-2" />
                        <div className="text-white font-semibold text-sm">
                          Content Scheduler
                        </div>
                        <div className="text-gray-400 text-xs">
                          47 posts scheduled
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Smart Scheduling
                </h3>
                <p className="text-gray-400 text-sm">
                  Schedule content across multiple platforms with optimal timing
                  suggestions.
                </p>
              </div>
            </div>

            {/* Account Manager */}
            <div className="relative">
              <div className="bg-gradient-cawar-card rounded-2xl p-6 border border-white/5 shadow-gradient-cawar">
                <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden mb-4">
                  <div className="p-4 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <div className="flex justify-center gap-2">
                          <Instagram className="w-6 h-6 text-pink-400" />
                          <Youtube className="w-6 h-6 text-red-400" />
                          <Twitter className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="text-white font-semibold text-sm">
                          Connected Accounts
                        </div>
                        <div className="text-emerald-400 text-xs">
                          All platforms active
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Account Manager
                </h3>
                <p className="text-gray-400 text-sm">
                  Connect and manage all your social media accounts from one
                  dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Why choose us over legacy tools?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-cawar-card border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Affordable
              </h3>
              <p className="text-purple-200">
                Pricing made for real creators, not agencies.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-cawar-card border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Focused</h3>
              <p className="text-purple-200">
                No bloated features—just what you actually need.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-cawar-card border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧘‍♂️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Simple UI
              </h3>
              <p className="text-purple-200">Built for speed, not headaches.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-cawar-card border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Privacy-First
              </h3>
              <p className="text-purple-200">
                Your credentials stay secure—always.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Loved by creators worldwide
            </h2>
            <p className="text-xl text-purple-200">
              Real feedback from real users
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 bg-gradient-cawar-card border-white/10 shadow-gradient-cawar">
              <CardContent className="p-0">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-purple-200 mb-4">
                  "Took my posting time from 2 hours to 15 minutes a week. Game
                  changer for my side project!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    R
                  </div>
                  <div>
                    <div className="font-semibold text-white">Raj K.</div>
                    <div className="text-purple-300 text-sm">Indie Maker</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-cawar-card border-white/10 shadow-gradient-cawar">
              <CardContent className="p-0">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-purple-200 mb-4">
                  "The dashboard and analytics made it 10x easier to scale our
                  content strategy."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    T
                  </div>
                  <div>
                    <div className="font-semibold text-white">Tanya M.</div>
                    <div className="text-purple-300 text-sm">
                      Growth Manager
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-cawar-card border-white/10 shadow-gradient-cawar">
              <CardContent className="p-0">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-purple-200 mb-4">
                  "A life-saver for side projects. Honestly just works without
                  any fuss."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    A
                  </div>
                  <div>
                    <div className="font-semibold text-white">Aditya</div>
                    <div className="text-purple-300 text-sm">Dev Founder</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Simple pricing. No contracts.
            </h2>
            <p className="text-xl text-purple-200">
              Cancel anytime. Start free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <Card className="p-8 bg-gradient-cawar-card border-white/10 hover:border-purple-500/50 transition-colors">
              <CardContent className="p-0">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2 text-white">
                    Starter
                  </h3>
                  <div className="text-4xl font-bold mb-4 text-white">
                    $9<span className="text-lg text-purple-300">/month</span>
                  </div>
                  <p className="text-purple-200 mb-6">
                    Perfect for individuals
                  </p>

                  <Button className="w-full mb-6 bg-white/10 hover:bg-white/20 text-white border-0">
                    Start Free Trial
                  </Button>

                  <div className="text-left space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                      <span className="text-purple-200">5 Social Accounts</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                      <span className="text-purple-200">Auto-posting</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                      <span className="text-purple-200">
                        Analytics Dashboard
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                      <span className="text-purple-200">Unlimited Posts</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Creator Plan */}
            <Card className="p-8 bg-gradient-cawar-card border-purple-500 relative overflow-hidden shadow-gradient-cawar">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gradient-cawar-purple text-white px-4 py-1 text-sm font-medium rounded-b">
                Most Popular
              </div>
              <CardContent className="p-0 pt-4">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2 text-white">
                    Creator
                  </h3>
                  <div className="text-4xl font-bold mb-4 text-white">
                    $18<span className="text-lg text-purple-300">/month</span>
                  </div>
                  <p className="text-purple-200 mb-6">
                    Best for growing creators
                  </p>

                  <Button className="w-full mb-6 bg-gradient-cawar-purple hover:opacity-90 text-white">
                    Start Free Trial
                  </Button>

                  <div className="text-left space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                      <span className="text-purple-200">
                        15 Social Accounts
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                      <span className="text-purple-200">Auto-posting</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                      <span className="text-purple-200">
                        Analytics Dashboard
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                      <span className="text-purple-200">
                        Platform Customization
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                      <span className="text-purple-200">1 Team Member</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="p-8 bg-gradient-cawar-card border-white/10 hover:border-purple-500/50 transition-colors">
              <CardContent className="p-0">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2 text-white">Pro</h3>
                  <div className="text-4xl font-bold mb-4 text-white">
                    $27<span className="text-lg text-purple-300">/month</span>
                  </div>
                  <p className="text-purple-200 mb-6">For teams and agencies</p>

                  <Button className="w-full mb-6 bg-white/10 hover:bg-white/20 text-white border-0">
                    Start Free Trial
                  </Button>

                  <div className="text-left space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                      <span className="text-purple-200">
                        Unlimited Accounts
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                      <span className="text-purple-200">Auto-posting</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                      <span className="text-purple-200">
                        Analytics Dashboard
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                      <span className="text-purple-200">
                        Platform Customization
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                      <span className="text-purple-200">3+ Team Members</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-purple-200">🧪 Try it free. No card required.</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Start scheduling smarter—today.
          </h2>
          <p className="text-xl mb-8 text-purple-200">
            Join thousands of creators who save 3+ hours every week with Quolo.
          </p>
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
          <p className="text-sm mt-4 text-purple-300">
            No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-cawar-darker text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-cawar-dark rounded-xl flex items-center justify-center shadow-lg">
                  <Image
                    src={image2}
                    alt="Quolo Logo"
                    className="w-full h-full object-cover"
                    width={40}
                    height={40}
                  />{" "}
                </div>
                <span className="text-xl font-bold">Quolo</span>
              </div>
              <p className="text-purple-300">
                Built for creators who want to grow smarter, not harder.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-purple-300">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-white transition-colors"
                  >
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
              <ul className="space-y-2 text-purple-300">
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
              <ul className="space-y-2 text-purple-300">
                <li>
                  <a href="/terms.html" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="/privacy.html" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center text-purple-300">
            <p>© 2025 Quolo – Built for creators</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
