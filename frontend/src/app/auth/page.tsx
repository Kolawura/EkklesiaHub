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
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AuthForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { loginMutation, registerMutation, isLoadingUser } = useAuth();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    loginMutation.mutate({ email, password });
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const fullName = (form.get("name") as string)?.trim();
    const email = form.get("signup-email") as string;
    const password = form.get("signup-password") as string;

    // Split full name into first and last
    const [firstName, ...last] = fullName.split(" ");
    const lastName = last.join(" ") || "";

    registerMutation.mutate({
      firstName,
      lastName,
      email,
      password,
    });
  };

  return (
    <div className="space-y-6 p-6 md:p-12 lg:p-24">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-primary-foreground rounded-sm" />
          </div>
          <span className="text-xl font-semibold text-foreground">
            AuthFlow
          </span>
        </div>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Welcome to the future of authentication
        </h1>
        <p className="text-muted-foreground text-pretty">
          Secure, fast, and beautifully designed for modern applications
        </p>
      </div>

      {/* Tabs */}
      <Card className="border w-1/3 mx-auto">
        <Tabs defaultValue="login" className="w-full">
          <CardHeader className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* LOGIN FORM */}
            <TabsContent value="login" className="space-y-4 mt-0">
              <div className="space-y-2 text-center">
                <CardTitle className="text-xl text-card-foreground">
                  Sign in to your account
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Enter your credentials to access your dashboard
                </CardDescription>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="Enter your email"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-0">
              <div className="space-y-2 text-center">
                <CardTitle className="text-xl text-card-foreground">
                  Create your account
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Join thousands of users building the future
                </CardDescription>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Enter your full name"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      name="signup-email"
                      type="email"
                      required
                      placeholder="Enter your email"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      name="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending
                    ? "Creating account..."
                    : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Footer */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Secured by industry-standard encryption and privacy practices
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
