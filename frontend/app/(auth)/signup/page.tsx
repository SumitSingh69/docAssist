"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Check,
} from "lucide-react";
import { useAuth } from "@/context/auth.context";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");

  // Password strength indicators
  const hasMinLength = formData.password.length >= 6;
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!hasMinLength) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    const result = await signup(formData);

    if (result.success) {
      router.push("/login");
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full">
      {/* Card */}
      <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Create account
          </h1>
          <p className="text-muted-foreground text-sm">
            Join us and start your health journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary"
                required
              />
            </div>
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="9876543210"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="pl-10 h-11 bg-background/50 border-border/50 focus:border-primary"
                maxLength={10}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="pl-10 pr-10 h-11 bg-background/50 border-border/50 focus:border-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Password Strength Indicators */}
            {formData.password && (
              <div className="flex gap-3 text-xs mt-2">
                <span
                  className={`flex items-center gap-1 ${
                    hasMinLength ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Check className="w-3 h-3" /> 6+ chars
                </span>
                <span
                  className={`flex items-center gap-1 ${
                    hasUppercase ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Check className="w-3 h-3" /> Uppercase
                </span>
                <span
                  className={`flex items-center gap-1 ${
                    hasNumber ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Check className="w-3 h-3" /> Number
                </span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium mt-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Create account
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card/50 px-2 text-muted-foreground">
              Already have an account?
            </span>
          </div>
        </div>

        {/* Login Link */}
        <Link href="/login">
          <Button
            variant="outline"
            className="w-full h-11 border-border/50 hover:bg-accent/50"
          >
            Sign in instead
          </Button>
        </Link>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground ">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="text-primary hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
