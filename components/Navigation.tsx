"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navigation() {
    const { data: session } = useSession();

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
