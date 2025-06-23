"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import CartItems from "../../components/CartItem";
import OrderSummary from "../../components/CartSummary";

export default function Cart() {
    const { data: session, status } = useSession();
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "authenticated") {
            fetchCart();
        } else if (status === "unauthenticated") {
            setIsLoading(false);
        }
    }, [status]);

    const fetchCart = async () => {
        try {
            const res = await fetch("/api/cart");
            if (!res.ok) {
                throw new Error(`Failed to fetch cart: ${res.status}`);
            }
            const data = await res.json();
            if (Array.isArray(data.items)) {
                setCartItems(data.items);
            } else {
                throw new Error("Invalid cart data format");
            }
        } catch (err) {
            setError(`Failed to load cart: ${err.message}`);
            console.error("Fetch cart error:", err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateQuantity = async (productId, quantity) => {
        try {
            const res = await fetch("/api/cart", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity }),
            });
            if (res.ok) {
                const data = await res.json();
                setCartItems(data.items);
                window.dispatchEvent(new Event("cartUpdated"));
            } else {
                const errorData = await res.json();
                alert(
                    `Failed to update quantity: ${
                        errorData.error || "Unknown error"
                    }`
                );
            }
        } catch (error) {
            alert("Error updating quantity");
            console.error("Update quantity error:", error.message);
        }
    };

    const handleRemoveFromCart = async (productId) => {
        try {
            const res = await fetch("/api/cart", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });
            if (res.ok) {
                const data = await res.json();
                setCartItems(data.items);
                window.dispatchEvent(new Event("cartUpdated"));
            } else {
                const errorData = await res.json();
                alert(
                    `Failed to remove item: ${
                        errorData.error || "Unknown error"
                    }`
                );
            }
        } catch (error) {
            alert("Error removing item");
            console.error("Remove from cart error:", error.message);
        }
    };

    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
                    <div
                        className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-500 rounded-full animate-spin"
                        style={{ animationDirection: "reverse" }}
                    ></div>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-2xl max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <ShoppingBag className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Access Required
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Please{" "}
                        <Link
                            href="/auth/login"
                            className="text-purple-600 hover:text-purple-700 underline transition-colors font-medium"
                        >
                            log in
                        </Link>{" "}
                        to view your cart.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                {cartItems.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <ShoppingBag className="w-16 h-16 text-gray-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Add some products to get started!
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <ShoppingBag className="w-5 h-5 mr-2" />
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <CartItems
                            cartItems={cartItems}
                            handleUpdateQuantity={handleUpdateQuantity}
                            handleRemoveFromCart={handleRemoveFromCart}
                        />
                        <OrderSummary cartItems={cartItems} />
                    </div>
                )}
            </div>
        </div>
    );
}
