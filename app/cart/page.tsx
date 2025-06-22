"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

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

    const totalPrice = cartItems.reduce((total, item) => {
        const price = Number(item.price) || 0;
        return total + price * item.quantity;
    }, 0);

    if (status === "loading" || isLoading) return <div>Loading...</div>;
    if (!session)
        return (
            <div>
                Please{" "}
                <Link href="/auth/login" className="text-blue-500">
                    log in
                </Link>{" "}
                to view your cart.
            </div>
        );

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <div
                            key={item.productId}
                            className="flex items-center border p-4 rounded shadow"
                        >
                            <img
                                src={item.image || "/placeholder.jpg"}
                                alt={item.name}
                                className="h-16 w-16 object-cover rounded mr-4"
                            />
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold">
                                    {item.name}
                                </h2>
                                <p className="text-gray-600">
                                    ${Number(item.price).toFixed(2)} x{" "}
                                    {item.quantity}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() =>
                                        handleUpdateQuantity(
                                            item.productId,
                                            item.quantity - 1
                                        )
                                    }
                                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                                    disabled={item.quantity <= 1}
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() =>
                                        handleUpdateQuantity(
                                            item.productId,
                                            item.quantity + 1
                                        )
                                    }
                                    className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                                >
                                    +
                                </button>
                                <button
                                    onClick={() =>
                                        handleRemoveFromCart(item.productId)
                                    }
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="mt-6 p-4 border rounded shadow">
                        <h2 className="text-xl font-semibold mb-2">
                            Order Summary
                        </h2>
                        <p className="text-lg">
                            Total: ${totalPrice.toFixed(2)}
                        </p>
                        <Link
                            href="/checkout"
                            className="mt-4 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
