"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Check,
    X,
    AlertCircle,
} from "lucide-react";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const router = useRouter();

    // Password strength checker
    const checkPasswordStrength = (pass: string) => {
        let strength = 0;
        if (pass.length >= 8) strength++;
        if (/[A-Z]/.test(pass)) strength++;
        if (/[a-z]/.test(pass)) strength++;
        if (/[0-9]/.test(pass)) strength++;
        if (/[^A-Za-z0-9]/.test(pass)) strength++;
        return strength;
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(checkPasswordStrength(newPassword));
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength < 2) return "bg-red-500";
        if (passwordStrength < 4) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength < 2) return "Weak";
        if (passwordStrength < 4) return "Medium";
        return "Strong";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Validation
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        if (passwordStrength < 3) {
            setError("Please choose a stronger password");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name }),
            });

            if (res.ok) {
                router.push(
                    "/auth/login?message=Registration successful! Please sign in."
                );
            } else {
                const data = await res.json();
                setError(data.error || "Registration failed");
            }
        } catch (error) {
            console.error(error);
            setError("Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-4 relative">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden z-[-1]">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full opacity-50 blur-3xl"></div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-tr from-blue-100 to-pink-100 rounded-full opacity-50 blur-3xl"></div>
            </div>
            <div className="relative w-full max-w-md z-10">
                {/* Main register card */}
                <div className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-xl rounded-3xl p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mb-4 shadow-md">
                            <User className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            Create Account
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Join us and start shopping today
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name field */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-semibold text-gray-700 mb-1"
                            >
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-white/70"
                                    placeholder="Enter your full name"
                                    required
                                    aria-describedby="name-hint"
                                />
                            </div>
                        </div>

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
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-white/70"
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
                                    onChange={handlePasswordChange}
                                    className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg bg-white/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-white/70"
                                    placeholder="Create a strong password"
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
                            {/* Password strength indicator */}
                            {password && (
                                <div className="mt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                style={{
                                                    width: `${
                                                        (passwordStrength / 5) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>
                                        <span
                                            className={`text-xs font-medium ${
                                                passwordStrength < 2
                                                    ? "text-red-600"
                                                    : passwordStrength < 4
                                                    ? "text-yellow-600"
                                                    : "text-green-600"
                                            }`}
                                        >
                                            {getPasswordStrengthText()}
                                        </span>
                                    </div>
                                    <p
                                        id="password-hint"
                                        className="text-xs text-gray-500 mt-1"
                                    >
                                        Use 8+ characters with uppercase,
                                        lowercase, numbers, and symbols
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password field */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-semibold text-gray-700 mb-1"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    className="w-full pl-10 pr-12 py-2.5 border border-gray-200 rounded-lg bg-white/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:bg-white/70"
                                    placeholder="Confirm your password"
                                    required
                                    aria-describedby="confirm-password-hint"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            {/* Password match indicator */}
                            {confirmPassword && (
                                <div className="mt-2 flex items-center gap-2">
                                    {password === confirmPassword ? (
                                        <div className="flex items-center gap-1 text-green-600">
                                            <Check className="h-4 w-4" />
                                            <span className="text-xs font-medium">
                                                Passwords match
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-red-600">
                                            <X className="h-4 w-4" />
                                            <span className="text-xs font-medium">
                                                <span className="text-xs font-medium">
                                                    Passwords don&apos;t match
                                                </span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
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

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.01] shadow-md"
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
                                    Creating Account...
                                </div>
                            ) : (
                                "Create Account"
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
                                Already have an account?
                            </span>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
                            aria-label="Sign in to your account"
                        >
                            <svg
                                className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                                />
                            </svg>
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
