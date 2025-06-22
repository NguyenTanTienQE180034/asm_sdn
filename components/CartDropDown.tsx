"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

export default function CartDropdown() {
    const { data: session } = useSession();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [cartRefresh, setCartRefresh] = useState(0);
    const cartRef = useRef(null);

    // Fetch cart items
    useEffect(() => {
        const fetchCart = async () => {
            if (!session) return;
            try {
                const res = await fetch("/api/cart");
                if (!res.ok) {
                    throw new Error(`Failed to fetch cart: ${res.status}`);
                }
                const data = await res.json();
                if (Array.isArray(data.items)) {
                    setCartItems(data.items);
                } else {
                    console.error("Invalid cart data format:", data);
                    setCartItems([]);
                }
            } catch (error) {
                console.error("Fetch cart error:", error.message);
                setCartItems([]);
            }
        };

        fetchCart();
    }, [session, cartRefresh]);

    // Close cart dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cartRef.current && !cartRef.current.contains(event.target)) {
                setIsCartOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Listen for cart updates
    useEffect(() => {
        const handleCartUpdate = () => {
            setCartRefresh((prev) => prev + 1);
        };
        window.addEventListener("cartUpdated", handleCartUpdate);
        return () =>
            window.removeEventListener("cartUpdated", handleCartUpdate);
    }, []);

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
            console.error("Update quantity error:", error.message);
            alert("Error updating quantity");
        }
    };

    return (
        <div className="relative" ref={cartRef}>
            <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="text-white hover:text-blue-200 transition flex items-center"
            >
                <ShoppingCartIcon className="h-6 w-6" />
                {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItems.length}
                    </span>
                )}
            </button>
            {isCartOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl p-4 z-10">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Your Cart
                    </h3>
                    {cartItems.length === 0 ? (
                        <p className="text-gray-600">Your cart is empty.</p>
                    ) : (
                        <div className="max-h-60 overflow-y-auto">
                            {cartItems.map((item) => (
                                <div
                                    key={item.productId}
                                    className="flex items-center border-b py-2"
                                >
                                    <img
                                        src={item.image || "/placeholder.jpg"}
                                        alt={item.name}
                                        className="h-12 w-12 object-cover rounded mr-2"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800">
                                            {item.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            ${Number(item.price).toFixed(2)} x{" "}
                                            {item.quantity}
                                        </p>
                                        <div className="flex items-center space-x-2 mt-1">
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
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <Link
                        href="/cart"
                        className="block mt-4 bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600 transition"
                        onClick={() => setIsCartOpen(false)}
                    >
                        View Cart
                    </Link>
                </div>
            )}
        </div>
    );
}
