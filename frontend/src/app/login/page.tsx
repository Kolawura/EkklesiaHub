"use client";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { loginMutation, isLoadingUser } = useAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    loginMutation.mutate({ email, password });
  };

  if (isLoadingUser) return <p>Loading user...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 flex flex-col gap-4 border p-6 rounded-lg"
    >
      <h1 className="text-2xl font-semibold">Login</h1>

      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="border p-2 rounded"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="border p-2 rounded"
      />

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </button>

      {loginMutation.data?.error && (
        <p className="text-red-500 text-sm">{loginMutation.data.message}</p>
      )}
    </form>
  );
}
