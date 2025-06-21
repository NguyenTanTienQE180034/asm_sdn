"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useSearch } from "../context/SearchContext";
export default function Navigation() {
    const { data: session } = useSession();
    const { search, setSearch } = useSearch();
    return (
        <nav className="bg-blue-800 p-4">
            <div className="container mx-auto flex justify-between">
                <div className="flex space-x-4">
                    <Link href="/" className="text-white text-lg font-bold">
                        E-Commerce
                    </Link>
                    <Link href="/products" className="text-white">
                        Products
                    </Link>
                    {session && (
                        <>
                            <Link href="/cart" className="text-white">
                                Cart
                            </Link>
                            <Link href="/orders" className="text-white">
                                Orders
                            </Link>
                            <Link href="/products/new" className="text-white">
                                Add Product
                            </Link>
                        </>
                    )}
                </div>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex items-center mr-4"
                >
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="rounded px-2 py-1 mr-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </form>
                <div>
                    {session ? (
                        <button
                            onClick={() => signOut()}
                            className="text-white"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link
                                href="/auth/login"
                                className="text-white mr-4"
                            >
                                Login
                            </Link>
                            <Link href="/auth/register" className="text-white">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
