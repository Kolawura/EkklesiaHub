import { postRequest, deleteRequest } from "@/lib/service";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "./useToast";
import { useAuth } from "./useAuth";

export const useSettings = () => {
  const queryClient = useQueryClient();
  const { logoutMutation } = useAuth();

  const [pwForm, setPwForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [deletePassword, setDeletePassword] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [emailForm, setEmailForm] = useState({ newEmail: "", password: "" });

  const changePwMutation = useMutation({
    mutationFn: () =>
      postRequest("/auth/change-password", {
        currentPassword: pwForm.current,
        newPassword: pwForm.next,
      }),
    onSuccess: (data) => {
      if (data?.success) {
        toast({ title: "Password updated!", variant: "success" });
        setPwForm({ current: "", next: "", confirm: "" });
      } else
        toast({
          title: data?.message ?? "Failed to update password",
          variant: "destructive",
        });
    },
    onError: () =>
      toast({ title: "Failed to update password", variant: "destructive" }),
  });

  const handleChangePassword = () => {
    if (!pwForm.current || !pwForm.next)
      return toast({ title: "All fields required", variant: "destructive" });
    if (pwForm.next !== pwForm.confirm)
      return toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
    if (pwForm.next.length < 8)
      return toast({
        title: "Minimum 8 characters",
        variant: "destructive",
      });
    changePwMutation.mutate();
  };

  const changeEmailMutation = useMutation({
    mutationFn: () => postRequest("/auth/change-email", emailForm),
    onSuccess: (data) => {
      if (data?.success) {
        toast({ title: "Email updated!", variant: "success" });
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        setEmailForm({ newEmail: "", password: "" });
      } else
        toast({
          title: data?.message ?? "Failed to update email",
          variant: "destructive",
        });
    },
    onError: () =>
      toast({ title: "Failed to update email", variant: "destructive" }),
  });

  const handleChangeEmail = () => {
    if (!emailForm.newEmail || !emailForm.password)
      return toast({ title: "All fields required", variant: "destructive" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.newEmail))
      return toast({
        title: "Invalid email address",
        variant: "destructive",
      });
    changeEmailMutation.mutate();
  };

  const deleteAccountMutation = useMutation({
    mutationFn: () =>
      deleteRequest("/auth/account", { password: deletePassword }),
    onSuccess: () => {
      toast({ title: "Account deleted. Goodbye.", variant: "success" });
      logoutMutation.mutate();
    },
    onError: () =>
      toast({ title: "Failed to delete account", variant: "destructive" }),
  });
  return {
    pwForm,
    setPwForm,
    emailForm,
    setEmailForm,
    confirmDelete,
    setConfirmDelete,
    deletePassword,
    setDeletePassword,
    handleChangeEmail,
    handleChangePassword,
    changeEmailMutation,
    changePwMutation,
    deleteAccountMutation,
  };
};
