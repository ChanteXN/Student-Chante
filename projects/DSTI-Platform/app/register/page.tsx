"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, AlertCircle, Building2, User, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organizationName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setSuccess(true);
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push("/login?registered=true");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isFormValid = formData.name.trim() && formData.email.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              DSTI R&D Platform
            </h1>
          </Link>
          <p className="text-muted-foreground">Create your applicant account</p>
        </div>

        {!success ? (
          <Card className="shadow-xl border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Create Account</CardTitle>
              <CardDescription className="text-center">
                Start your R&D Tax Incentive application journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="pl-10 h-11 focus-visible:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@company.co.za"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-10 h-11 focus-visible:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    We&apos;ll send a secure magic link to this email
                  </p>
                </div>

                {/* Organization Name */}
                <div>
                  <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name (Optional)
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="organizationName"
                      name="organizationName"
                      type="text"
                      placeholder="Acme Technologies (Pty) Ltd"
                      value={formData.organizationName}
                      onChange={handleChange}
                      className="pl-10 h-11 focus-visible:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    You can add this later in your profile
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {/* Terms */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs text-gray-600">
                  By registering, you agree to comply with DSTI&apos;s application terms and provide
                  accurate information in your R&D Tax Incentive submission.
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all">
                    Sign In
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
                <p className="text-gray-700 mb-4">
                  Your account has been created successfully.
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  Redirecting you to the login page...
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
