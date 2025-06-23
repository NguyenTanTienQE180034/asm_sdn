"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });
            if (result?.error) {
                setError(result.error);
            } else {
                router.push("/");
            }
        } catch (error) {
            console.error(error);
            setError("Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-4 relative">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden z-[-1]">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-50 blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full opacity-50 blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md z-10">
                {/* Main login card */}
                <div className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-xl rounded-3xl p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mb-4 shadow-md">
                            <Lock className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            Welcome Back
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Sign in to continue shopping
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-gray-700 mb-1"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white/70"
                                    placeholder="Enter your email"
                                    required
                                    aria-describedby="email-hint"
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-gray-700 mb-1"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg bg-white/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white/70"
                                    placeholder="Enter your password"
                                    required
                                    aria-describedby="password-hint"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                                <p className="text-red-700 text-sm font-medium">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Forgot password link */}
                        <div className="text-right">
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200"
                                aria-label="Forgot your password"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.01] shadow-md"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Signing In...
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">
                                New to our platform?
                            </span>
                        </div>
                    </div>

                    {/* Register link */}
                    <div className="text-center">
                        <Link
                            href="/auth/register"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
                            aria-label="Create a new account"
                        >
                            Create an Account
                            <svg
                                className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
