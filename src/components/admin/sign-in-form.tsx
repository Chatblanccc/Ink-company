"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl: "/admin/dashboard",
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid credentials. Try the demo admin account.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue="admin@ink-company.com"
          autoComplete="email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          defaultValue="InkAdmin2026!"
          autoComplete="current-password"
          required
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-12 w-full rounded-full bg-sky-500 text-white hover:bg-sky-400"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in"}
      </Button>

      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <p className="text-sm leading-7 text-slate-500">
        Demo credentials are prefilled. You can later replace them with seeded
        PostgreSQL users.
      </p>
    </form>
  );
}
