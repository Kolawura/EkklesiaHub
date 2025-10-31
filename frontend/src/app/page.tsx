"use client";

import { useAuth } from "@/hooks/useAuth";
import LandingLayout from "./(landing)/layout";
import AppLayout from "./(app)/layout";
import { HomePage } from "@/app/(app)/home/HomePage";
import { LandingPage } from "@/app/(landing)/home/landingPage";
import Loading from "@/components/Loading";

export default function App() {
  const { user, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return <Loading />;
  }

  if (!user) {
    return (
      <LandingLayout>
        <LandingPage />
      </LandingLayout>
    );
  }

  return (
    <AppLayout>
      <HomePage />
    </AppLayout>
  );
}
