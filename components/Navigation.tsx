"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useSearch } from "../context/SearchContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import CartDropdown from "../components/CartDropDown";

export default function Navigation() {
    const { data: session } = useSession();
    const { search, setSearch } = useSearch();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-blue-800 shadow-lg">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-white text-2xl font-bold tracking-tight"
                    >
                        E-Commerce
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white focus:outline-none"
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? (
                            <Bars3Icon className="h-6 w-6" />
                        ) : (
                            <XMarkIcon className="h-6 w-6" />
                        )}
                    </button>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        {session && (
                            <>
                                <Link
                                    href="/products"
                                    className="text-white hover:text-blue-200 transition"
                                >
                                    Products
                                </Link>
                                <Link
                                    href="/orders"
                                    className="text-white hover:text-blue-200 transition"
                                >
                                    Orders
                                </Link>
                                <Link
                                    href="/products/new"
                                    className="text-white hover:text-blue-200 transition"
                                >
                                    Add Product
                                </Link>
                                <CartDropdown />
                            </>
                        )}
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="flex items-center"
                        >
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="rounded-l-md px-3 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-48"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-3 py-1 rounded-r-md hover:bg-blue-700 transition"
                            >
                                Search
                            </button>
                        </form>
                        {session ? (
                            <button
                                onClick={() => signOut()}
                                className="text-white hover:text-blue-200 transition"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    className="text-white hover:text-blue-200 transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="text-white hover:text-blue-200 transition"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 space-y-2">
                        {session && (
                            <>
                                <Link
                                    href="/products"
                                    className="block text-white hover:text-blue-200 transition py-1"
                                    onClick={toggleMobileMenu}
                                >
                                    Products
                                </Link>
                                <Link
                                    href="/orders"
                                    className="block text-white hover:text-blue-200 transition py-1"
                                    onClick={toggleMobileMenu}
                                >
                                    Orders
                                </Link>
                                <Link
                                    href="/products/new"
                                    className="block text-white hover:text-blue-200 transition py-1"
                                    onClick={toggleMobileMenu}
                                >
                                    Add Product
                                </Link>
                                <Link
                                    href="/cart"
                                    className="block text-white hover:text-blue-200 transition py-1"
                                    onClick={toggleMobileMenu}
                                >
                                    Cart
                                </Link>
                            </>
                        )}
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="flex items-center py-1"
                        >
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="rounded-l-md px-3 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-3 py-1 rounded-r-md hover:bg-blue-700 transition"
                            >
                                Search
                            </button>
                        </form>
                        {session ? (
                            <button
                                onClick={() => {
                                    signOut();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="block text-white hover:text-blue-200 transition py-1"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    className="block text-white hover:text-blue-200 transition py-1"
                                    onClick={toggleMobileMenu}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="block text-white hover:text-blue-200 transition py-1"
                                    onClick={toggleMobileMenu}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
