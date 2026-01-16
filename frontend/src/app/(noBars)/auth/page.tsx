"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const AuthForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loginMutation, registerMutation } = useAuth();
  const route = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    try {
      const login = await loginMutation.mutateAsync({ email, password });
      if (login.success) {
        route.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const fullName = (form.get("name") as string)?.trim();
    const email = form.get("signup-email") as string;
    const password = form.get("signup-password") as string;

    const [firstName, ...last] = fullName.split(" ");
    const lastName = last.join(" ") || "";
    try {
      const register = await registerMutation.mutateAsync({
        firstName,
        lastName,
        email,
        password,
      });
      if (register.success) {
        route.push("/");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Gradient Background */}
      {/* <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-black to-orange-500/10"></div>
        <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-40 w-80 h-80 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div> */}

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Branding & Features */}
          <div className="hidden lg:block space-y-8 animate-fadeIn">
            {/* Logo & Brand */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">
                  WriterHub
                </span>
              </div>

              <h1 className="text-5xl text-foreground font-bold leading-tight">
                Welcome to the future of{" "}
                <span className="bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">
                  storytelling
                </span>
              </h1>

              <p className="text-xl text-muted-foreground">
                Join thousands of writers sharing their voice and building
                communities worldwide
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-bold text-lg mb-1">
                      Secure & Private
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Industry-standard encryption protects your data and
                      creative work
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-orange-500/50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Lightning Fast</h3>
                    <p className="text-muted-foreground text-sm">
                      Start writing and connecting with your community in
                      seconds
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent mb-1">
                  50K+
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Writers
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent mb-1">
                  1M+
                </div>
                <div className="text-sm text-muted-foreground">
                  Stories Shared
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent mb-1">
                  500+
                </div>
                <div className="text-sm text-muted-foreground">Communities</div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-full animate-fadeIn animation-delay-300">
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl">
              {/* Mobile Logo */}
              <div className="lg:hidden p-6 text-center border-b border-white/10">
                <div className="inline-flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">
                    WriterHub
                  </span>
                </div>
              </div>

              <Tabs defaultValue="login" className="w-full">
                <CardHeader className="space-y-4 border-b border-white/10">
                  <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 rounded-xl">
                    <TabsTrigger
                      value="login"
                      className="data-[state=active]:bg-gradient-to-r py-2 data-[state=active]:from-blue-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="signup"
                      className="data-[state=active]:bg-gradient-to-r py-2 data-[state=active]:from-blue-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent className="space-y-4 p-6 sm:p-8">
                  {/* LOGIN FORM */}
                  <TabsContent value="login" className="space-y-6 mt-0">
                    <div className="space-y-2 text-center">
                      <CardTitle className="text-2xl">Welcome back</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Enter your credentials to access your dashboard
                      </CardDescription>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium text-gray-300"
                        >
                          Email
                        </Label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="Enter your email"
                            className="pl-12 bg-white/5 border-white/10 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 placeholder:text-gray-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium text-gray-300"
                        >
                          Password
                        </Label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pl-12 pr-12 bg-white/5 border-white/10 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 placeholder:text-gray-500"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-3 hover:bg-transparent text-muted-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {loginMutation.isError && (
                        <Card className="bg-red-500/10 border-red-500/20 animate-shake">
                          <CardContent className="text-center p-3 text-red-400 text-sm">
                            {loginMutation.error instanceof Error
                              ? loginMutation.error.message
                              : "An error occurred during login."}
                          </CardContent>
                        </Card>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:opacity-90 h-12 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <span className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Signing in...
                          </span>
                        ) : (
                          "Sign In"
                        )}
                      </Button>

                      <div className="text-center">
                        <a
                          href="#"
                          className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
                        >
                          Forgot your password?
                        </a>
                      </div>
                    </form>
                  </TabsContent>

                  {/* SIGNUP FORM */}
                  <TabsContent value="signup" className="space-y-6 mt-0">
                    <div className="space-y-2 text-center">
                      <CardTitle className="text-2xl">
                        Create your account
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Join thousands of writers building the future
                      </CardDescription>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium text-gray-300"
                        >
                          Full Name
                        </Label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            placeholder="Enter your full name"
                            className="pl-12 bg-white/5 border-white/10 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 placeholder:text-gray-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="signup-email"
                          className="text-sm font-medium text-gray-300"
                        >
                          Email
                        </Label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                          <Input
                            id="signup-email"
                            name="signup-email"
                            type="email"
                            required
                            placeholder="Enter your email"
                            className="pl-12 bg-white/5 border-white/10 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 placeholder:text-gray-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="signup-password"
                          className="text-sm font-medium text-gray-300"
                        >
                          Password
                        </Label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                          <Input
                            id="signup-password"
                            name="signup-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            className="pl-12 pr-12 bg-white/5 border-white/10 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-12 placeholder:text-gray-500"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-3 hover:bg-transparent text-muted-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {registerMutation.isError && (
                        <Card className="bg-red-500/10 border-red-500/20 animate-shake">
                          <CardContent className="text-center p-3 text-red-400 text-sm">
                            {registerMutation.error instanceof Error
                              ? registerMutation.error.message
                              : "An error occurred during registration."}
                          </CardContent>
                        </Card>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:opacity-90 h-12 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <span className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Creating account...
                          </span>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </CardContent>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 text-center">
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Shield className="w-4 h-4" />
                    Secured by industry-standard encryption
                  </p>
                </div>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AuthForm;
