"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
}

export default function ProductDetail() {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const { id } = useParams();
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) throw new Error("Product not found");
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                setError("Failed to load product");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!session) {
            router.push("/auth/login");
            return;
        }

        setIsAddingToCart(true);
        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: id, quantity: 1 }),
            });
            if (res.ok) {
                alert("Product added to cart");
            } else {
                alert("Failed to add to cart");
            }
        } catch (error) {
            console.error(error);
            alert("Error adding to cart");
        } finally {
            setIsAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="relative mb-8">
                        <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                        Loading Product
                    </h3>
                    <p className="text-gray-500 mt-2">Please wait...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center border border-gray-200">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Something went wrong
                    </h2>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center border border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Product Not Found
                    </h2>
                    <p className="text-gray-500 mb-6">
                        The product you&apos;re looking for doesn&apos;t exist.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition duration-300"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16l-4-4m0 0l4-4m-4 4h18"
                            />
                        </svg>
                        <span>Back to Shop</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Product Image Section */}
                    <div className="relative">
                        {product.image ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                width={600}
                                height={600}
                                className="w-full h-[400px] lg:h-[500px] object-cover rounded-lg shadow-md"
                            />
                        ) : (
                            <div className="w-full h-[400px] lg:h-[500px] bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                <div className="text-center">
                                    <svg
                                        className="w-16 h-16 text-gray-400 mx-auto mb-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <p className="text-gray-500 font-medium">
                                        No Image Available
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Product Info Section */}
                    <div className="space-y-6">
                        {/* Product Title */}
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                                {product.name}
                            </h1>

                            {/* Rating Stars */}
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="flex space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className="w-5 h-5 text-yellow-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-gray-500 font-medium">
                                    (4.9) • 2,847 reviews
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <p className="text-gray-600 text-base leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Price Section */}
                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium mb-2">
                                        Price
                                    </p>
                                    <span className="text-3xl font-bold text-gray-800">
                                        ${product.price.toFixed(2)}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium mb-2">
                                        ✓ In Stock
                                    </div>
                                    <p className="text-gray-500 text-sm">
                                        Ready to ship
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            {session ? (
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAddingToCart}
                                    className="w-full bg-blue-500 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                                >
                                    {isAddingToCart ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                                            <span>Adding to Cart...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5.5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                                                />
                                            </svg>
                                            <span>Add to Cart</span>
                                        </>
                                    )}
                                </button>
                            ) : (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                                    <p className="text-gray-600 mb-4 text-base">
                                        Sign in to add this product to your cart
                                    </p>
                                    <Link
                                        href="/auth/login"
                                        className="inline-flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition duration-300"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                            />
                                        </svg>
                                        <span>Sign In</span>
                                    </Link>
                                </div>
                            )}

                            {/* Additional Features */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <svg
                                            className="w-4 h-4 text-green-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600 text-sm font-medium">
                                        Free Shipping
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                        Worldwide
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <svg
                                            className="w-4 h-4 text-blue-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600 text-sm font-medium">
                                        2 Year Warranty
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                        Premium Support
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
