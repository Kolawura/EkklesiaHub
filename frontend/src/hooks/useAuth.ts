"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
} from "@/lib/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { ApiResponse, User, LoginType, RegisterType } from "@/lib/type";
import { toast } from "@/hooks/useToast";

export const DEFAULT_POST_LOGIN = "/posts";

export const useAuth = (
  postLoginPath: () => string = () => DEFAULT_POST_LOGIN,
) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user: storedUser, setUser, logout } = useAuthStore();
  const isAuthenticated = !!storedUser;

  const userQuery = useQuery<ApiResponse<User>>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!storedUser,
  });

  useEffect(() => {
    if (userQuery.data?.success && userQuery.data?.data) {
      setUser(userQuery.data.data);
    } else if (userQuery.isError) {
      logout();
    }
  }, [userQuery.data, userQuery.isError, setUser, logout]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    loginMutation.mutate({
      email: fd.get("email") as string,
      password: fd.get("password") as string,
    });
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const full = (fd.get("name") as string).trim();
    const [firstName, ...rest] = full.split(" ");
    registerMutation.mutate({
      firstName,
      lastName: rest.join(" ") || "-",
      email: fd.get("email") as string,
      password: fd.get("password") as string,
    });
  };

  /* ── Login ── */
  const loginMutation = useMutation<ApiResponse<User>, Error, LoginType>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.success && data.data) {
        setUser(data.data);
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        toast({
          title: `Welcome back, ${data.data.firstName}!`,
          variant: "success",
        });
        router.push(postLoginPath());
      } else {
        toast({
          title: "Login failed",
          description: data.message || "Invalid email or password.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Login failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  /* ── Register ── */
  const registerMutation = useMutation<ApiResponse<User>, Error, RegisterType>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      if (data.success && data.data) {
        setUser(data.data);
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        toast({
          title: `Welcome to EkklesiaHub, ${data.data.firstName}!`,
          variant: "success",
        });
        // New users always go to the feed — never /dashboard on first sign-up
        router.push(DEFAULT_POST_LOGIN);
      } else {
        toast({
          title: "Registration failed",
          description: data.message || "Could not create account.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  /* ── Logout ── */
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSettled: () => {
      logout();
      queryClient.clear();
      router.push("/"); // back to landing page, not /auth
    },
  });

  const isPending = loginMutation.isPending || registerMutation.isPending;
  const error =
    loginMutation.error?.message || registerMutation.error?.message || null;

  return {
    user: storedUser,
    isLoadingUser: userQuery.isLoading,
    isAuthenticated,
    loginMutation,
    registerMutation,
    logoutMutation,
    isPending,
    error,
    handleLogin,
    handleRegister,
  };
};
