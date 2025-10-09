"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
} from "@/lib/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { ApiResponse, User, LoginType, RegisterType } from "@/lib/type";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { setUser, logout } = useAuthStore();

  const userQuery = useQuery<ApiResponse<User>>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (userQuery.data?.success && userQuery.data?.data) {
      setUser(userQuery.data.data);
    }
  }, [userQuery.data, setUser]);

  const loginMutation = useMutation<ApiResponse<User>, unknown, LoginType>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (data.success && data.data) {
        setUser(data.data);
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      }
    },
  });

  const registerMutation = useMutation<
    ApiResponse<User>,
    unknown,
    RegisterType
  >({
    mutationFn: registerUser,
    onSuccess: (data) => {
      if (data.success && data.data) {
        setUser(data.data);
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      }
    },
  });

  // ✅ Logout
  const logoutMutation = useMutation<ApiResponse<null>>({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      if (data.success) {
        logout();
        queryClient.removeQueries({ queryKey: ["currentUser"] });
      }
    },
  });

  return {
    user: userQuery.data?.data ?? null,
    isLoadingUser: userQuery.isLoading,
    loginMutation,
    registerMutation,
    logoutMutation,
  };
};
